/**
 *
 *
 */
import {loadDataSources} from './dataSourceComponents/AppModel';
import PubSub from 'pubsub-js';
import {dataLoaded} from '../../oldSrc/topics';

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

    fetch(configURL)   // load config files
      .then(r => r.json())
      .then(data => {
        this.header = data.header || '';
        this.attribution = data.attribution || '';
        this.initialConfig = data;
        let numSources = data.sources.length;
        let plural = numSources > 1 ? 's' : '';
        this.updateStatus(`loading ${numSources} data file${plural}...`); //update status and let index know about it.
        this.initialView = data.initialView;

        loadDataSources(data.sources)     //load all maps
          .then(am => {
            this.allMaps = am;
            this.bioMaps.push(this.allMaps[0]);
            this.setInitialView();
            this.status = 'Maps Loaded';
            //this.inform();
            this.toggleBusy();
          });
      })
      .then(stuff => console.log('test chain', stuff))
      .catch( error => {
        this.status = error;
        this.error = true;
      })
      .finally(() => this.inform());
              // load data sources
  }

  inform(){
    this.onChanges.forEach( callBack => callBack());
  }

  updateTestString(string){
    this.testString = string;
    this.inform();
  }

  updateStatus(string){
    this.status = string;
    this.inform();
  }

  addBioMap(map){
    this.bioMaps.concat(map);
    this.inform();
  }

  toggleBusy(){
    this.busy = !this.busy;
    this.inform();
  }

  setInitialView(){
    if (!this.initialView.length) {
      this.defaultInitialView();
    }
    else {
      this.setupInitialView();
    }
  }

  /**
   * create this.bioMaps based on initialView of config file.
   */

  setupInitialView() {
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
   */
  defaultInitialView() {
    this.bioMaps = this.sources.map(src => Object.values(src.bioMaps)[0]);
  }

}

function setInitialView(){
  console.log('set initial View',this);
  if (!this.initialView.length) {
    this.defaultInitialView();
  }
  else {
    this.setupInitialView();
  }
}

/**
 * create this.bioMaps based on initialView of config file.
 */

function setupInitialView() {
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
 */
function defaultInitialView() {
  this.bioMaps = this.sources.map(src => Object.values(src.bioMaps)[0]);
}