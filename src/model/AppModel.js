/**
 * App state - a global app state (or model), which can be referenced, viewed or
 * lensed, by various UI components. UI components should have only state needed
 * for their specific function, and should not cache, synchronize or duplicate
 * data from the app state.
 */
import PubSub from 'pubsub-js';
import {dataLoaded} from '../topics';

import {HorizontalLayout} from '../ui/layout/HorizontalLayout';
import {DataSourceModel} from './DataSourceModel';

export class AppModel {

  constructor() {
    // sources and bioMaps arrays will be populated in init()
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
    this.initialView = initialView;
    this.biomaps = [];
    let promises = sourceConfigs.map(config => {
      let dsm = new DataSourceModel(config);
      this.sources.push(dsm);
      return dsm.load();
    });
    // wait for all data sources are loaded, then set this.bioMaps with
    // only the maps named in initialView
    Promise.all(promises).then( () => {
      const allMaps = this.sources.map( src => Object.values(src.bioMaps) ).concatAll();
      this.bioMaps = this.initialView.map( uniqMapName => {
        const res = allMaps.filter(map => map.uniqueName === uniqMapName );
        if(res.length == 0) {
          // TODO: make a nice mithril component to display errors in the UI
          alert(`failed to resolve initialView entry: ${uniqMapName}`);
        }
        return res;
      }).concatAll();
      PubSub.publish(dataLoaded);
    }).
    catch( err => {
      // TODO: make a nice mithril component to display errors in the UI
      alert(`While fetching data source(s), ${err}`);
    });
    return promises;
  }

  reset() {
    console.log('reset state'); // TODO: implement reset of application model
  }
}
