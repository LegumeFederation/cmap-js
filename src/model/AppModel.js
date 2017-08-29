/**
 * App state - a global app state (or model), which can be referenced, viewed or
 * lensed, by various UI components. UI components should have only state needed
 * for their specific function, and should not cache, synchronize or duplicate
 * data from the app state.
 */
import PubSub from 'pubsub-js';

import {dataLoaded, reset, mapAdded} from '../topics';
import {HorizontalLayout} from '../ui/layout/HorizontalLayout';
import {DataSourceModel} from './DataSourceModel';

export class AppModel {

  constructor() {
    // sources and bioMaps arrays will be populated in load()
    this.sources = [];
    this.bioMaps = [];
    this.tools = {
      zoomFactor : 1,
      layout: HorizontalLayout // the default layout
    };
    this.selection = {
      // biomaps can be multi-selected by click or tap
      bioMaps: []
    };
    PubSub.subscribe(reset, () => this._onReset());
    // the status and busy properties are be displayed in the UI,
    // and can be freely changed via these properties
    this.status = '';
    this.busy = false;
  }

  /**
   * load the app model
   * @param Object - object with properties defined in cmap.json
   */
  load({header, attribution, sources, initialView}) {
    let sourceConfigs = sources;
    this.header = header;
    this.attribution = attribution;
    this.initialView = initialView || [];
    this.biomaps = [];
    let promises = sourceConfigs.map(config => {
      console.log('config',config);
      let dsm = new DataSourceModel(config);
      this.sources.push(dsm);
      console.log('push dsm',dsm);
      return dsm.load();
    });
    // wait for all data sources are loaded, then set this.bioMaps with
    // only the maps named in initialView
    //
    Promise.all(promises).then( () => {
      this.allMaps = this.sources.map( src => Object.values(src.bioMaps) ).concatAll();
      if(! this.initialView.length) {
        this.defaultInitialView();
      }
      else {
        this.setupInitialView();
      }
      PubSub.publish(dataLoaded);
    }).
    catch( err => {
      // TODO: make a nice mithril component to display errors in the UI
      const msg = `While fetching data source(s), ${err}`;
      console.error(msg);
      console.trace();
      alert(msg);
    });
    return promises;
  }

  /**
   * create this.bioMaps based on initialView of config file.
   */
  setupInitialView() {
    this.bioMaps = this.initialView.map( viewConf => {
      const res = this.allMaps.filter(map => {
        return (viewConf.source === map.source.id &&
                viewConf.map === map.name);
      });
      if(res.length == 0) {
        // TODO: make a nice mithril component to display errors in the UI
        const info = JSON.stringify(viewConf);
        const msg = `failed to resolve initialView entry: ${info}`;
        console.error(msg);
        console.trace();
        alert(msg);
      }
      if(viewConf.qtl){
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
    this.bioMaps = this.sources.map( src => Object.values(src.bioMaps)[0] );
  }

  /**
   * Add map at the given index (note, this is called by MapAdditionDialog)
   * @param Object bioMap - a bioMap from one of the already loaded data sources.
   * @param Number index - zero based index into the bioMaps array.
   */
  addMap(bioMap, index=0) {
    this.bioMaps.splice(index, 0, bioMap);
    PubSub.publish(mapAdded, bioMap);
  }

  /**
   * PubSub event handler
   */
  _onReset() {
    this.tools.zoomFactor  = 1;
    this.tools.layout = HorizontalLayout;
  }
}
