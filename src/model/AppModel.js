/**
 * AppModel object to maintain state of the data used to generate cmap-js views
 *
 */
import {loadDataSources, loadMaps} from './dataSourceComponents/DataLoader';
import {checkStatus} from '../util/fetch';

export default class AppModel {
  constructor(configURL,sub) {
    this.key = 'moo';
    this.allMaps = [];
    console.log('AM',this.key,this.allMaps.length);
    this.bioMaps = [];
    this.header = '';
    this.attribution = '';
    this.status = 'Loading configuration file.';
    this.busy = true;
    this.error = false;
    this.onChanges = [sub];
    this.testString = 'mu';
    this.initialConfig = {};
    this._loadDataFromConfig(configURL); //Set data from configuration file

  }

  // "reducers" for making model changes and informing Parent Component

  /**
   * Alerts parent component that there are changes to propegate
   * this is why you need to pass the onChanges setState({}) callback
   */
  inform(){
    this.onChanges.forEach(callBack => callBack());
  }

  /**
   * Update status message without changing busy or error state
   * @param string
   */
  updateStatus(string){
    this.status = string;
    this.inform();
  }

  /**
   * Adds BioMaps to the active bioMap array
   * @param maps
   * @param direction - 0 for add left, otherwise add right;
   */
  addBioMap(maps, direction = 0) {
    //test if map is actually an array of maps
    if (maps.constructor !== Array) maps = [maps];
    if (direction === 0) {
      this.bioMaps = maps.concat(this.bioMaps);
    } else {
      this.bioMaps = this.bioMaps.concat(maps);
    }

    this.inform();
  }

  /**
   * Removes BioMaps from the active bioMap array
   * @param maps
   */
  removeBioMap(maps) {
    if (maps.constructor !== Array) maps = [maps];
    maps.forEach(map => {
      this.bioMaps.splice(this.bioMaps.indexOf(map), 1);
    });
    this.inform();
  }

  /**
   * Toggles busy state
   */
  toggleBusy(){
    this.busy = !this.busy;
    this.inform();
  }

  /**
   * Toggle error state
   */
  toggleError() {
    this.error = !this.error;
    this.inform();
  }

  editFeatureTracks(baseMap, featureTracks) {
    this.bioMaps.some(map => {
      if (map === baseMap) {
        map.tracks = featureTracks;
        return true;
      }
      return false;
    });
    this.inform();
  }

  // Private Functions

  /**
   * Sets the Initial View after successful loading of data maps
   * @private
   */
  _setInitialView() {
    if (!this.initialView.length) {
      this._defaultInitialView();
    }
    else {
      this._setupInitialView();
    }
  }

  /**
   * create this.bioMaps based on initialView of config file.
   * @private
   */
  _setupInitialView() {
    this.bioMaps = this.initialView.map(viewConf => {
      const res = this.allMaps.filter(map => {
        return (viewConf.source === map.source.id &&
          viewConf.map === map.name);
      });
      if (res.length === 0) {
        // TODO: make a nice mithril component to display errors in the UI
        const info = JSON.stringify(viewConf);
        const msg = `failed to resolve initialView entry: ${info}`;
        console.error(msg);
        console.trace();
        alert(msg);
      }
      if(viewConf.tracks){
        res[0].tracks = viewConf.tracks;
      }
      if (viewConf.qtl) {
        res[0].qtlGroups = viewConf.qtl;
      }
      return res;
    }).concatAll();
  }

  /**
   * create this.bioMaps based on first map from each datasource (e.g if
   * initialView was not defined in config file).
   * @private
   */
  _defaultInitialView() {
    this.bioMaps = this.sources.map(src => Object.values(src.bioMaps)[0]);
  }

  /**
   * Request configuration file and map sets
   * @param configURL
   * @private
   */
  _loadDataFromConfig(configURL) {
    fetch(configURL)
      .then(r => checkStatus(r, configURL))// load config files
      .then(r => r.json())
      .then(data => {
        this.header = data.header || '';
        this.attribution = data.attribution || '';
        this.initialConfig = data;
        let numSources = data.sources.length;
        let plural = numSources > 1 ? 's' : '';
        this.updateStatus(`loading ${numSources} data file${plural}...`); //update status and let index know about it.
        this.initialView = data.initialView;

        // load config data sources as a set of promises to speed up process
        // and make error catching smoother.
        return loadDataSources(data.sources)
          .then(dataSources => {
            console.log('load data sources', dataSources);
            this.sources = dataSources;
            this.allMaps = loadMaps(dataSources);
            this.bioMaps.push(this.allMaps[0]);
            this._setInitialView();
            this.status = 'Maps Loaded';
            this.toggleBusy();
          })
          .catch((e) => {
            console.error(e);
            throw e;
          });
      })
      .catch(error => {
        //by this point, error should let it be known where the error comes from.
        this.status = error.toString();
        this.toggleError();
      })
      .finally(() => this.inform());
  }
}


