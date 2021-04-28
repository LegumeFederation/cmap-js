/**
 * @file
 * Instantiate the OldCmap class, and initialize it.
 * Also the entry point for bundling of javascript and css.
 */
/* polyfills and utilities */
import './polyfill/index';
//import './developmentTooling';
import './util/concatAll';
/* css */
import '../node_modules/normalize.css/normalize.css';
import '../node_modules/purecss/build/pure-min.css';
import './ui/css/cmap.css';
import './ui/css/cmap-header-menu.css';
import './ui/css/cmap-modals.css';
import './ui/css/cmap-maps.css';
/* mobx stores */
import UIStore from './model/UIStore';
/* preact and ui components */
import { h, render} from 'preact';
import {App} from './ui/App';
import DataStore from './model/DataStore';
import {autorun} from 'mobx';
import BioMapStore from './model/uiStoreComponents/BioMapStore';

//init mobx data model
const uiStore = new UIStore();

//load starting data
uiStore.dataStore.initDataStore('cmap.json');

// change cmap window title if header passed in config.
autorun(()=> {
  uiStore.setTitle(uiStore.dataStore.header);
});

// autorun to trigger when dataStore has finished loading
autorun(()=> {
  if(uiStore.dataStore.remaining === 0){
    uiStore.setMainWindowStatus('default');
  }
});
// autorun to update maps when new map is added
autorun(()=>{
  if(uiStore.mapOrder.length){
    uiStore.updateMainWindow();
    uiStore.mapOrder.forEach(map => {
      if(!uiStore.activeMaps[map]) {
        const keys = map.split('/');
        const newMap = new BioMapStore(uiStore);
        newMap.initMap(uiStore.dataStore.sources[keys[0]].maps[map], uiStore);
        uiStore.appendMap(map, newMap);
      }
    });
  }
});

autorun(()=>{
  console.log('ar', uiStore.redraw);
});
//render
render( <App uiStore={uiStore} />, document.querySelector('#cmap-div'));


