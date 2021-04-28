/**
 * DataStore
 * MobexStore for managing all loaded data sources, maps, and configurations
 */

import {makeObservable, observable, computed, action, autorun} from 'mobx';
import checkStatus from '../util/fetch';
import SourceStore from './dataStoreComponents/SourceStore';

export default class DataStore {
  constructor() {
    makeObservable(this, {
      header: observable,
      attribution: observable,
      sources: observable,
      canvasMaxHeight: observable,
      manhattans: observable,
      dataConfig: observable,
      errors: observable,
      numSources: computed,
      pendingSources: computed,
      initDataStore: action,
      loadDataSource: action,
      setHeader: action,
      setAttribution: action,
      setDataConfig: action,
      setCanvasMaxHeight: action,
    });

    autorun(() =>{
      if(this.pendingSources){
        this.pendingSources.forEach(source => {
          this.loadDataSource(source);
        });
      }
    });
  }

  header = '';
  attribution = '';
  canvasMaxHeight = -1;
  sources = {};
  manhattans = {};
  dataConfig = {};
  errors = [];

  get numSources(){
    return Object.keys(this.sources).length;
  }

  get numErrors(){
    return this.errors.length;
  }

  get remaining(){
    if(this.pendingSources === undefined){ return -1;}
    return this.pendingSources.length - this.loadedSources.length;
  }

  get loadedSources(){
    let ld = [];
    let keys = Object.keys(this.sources);
    keys.forEach(key => {if(this.sources[key].loaded){ld.push(this.sources[key]);}});
    let manKey = Object.keys(this.manhattans);
    manKey.forEach( key => {if(this.manhattans[key].loaded){ld.push(this.manhattans[key]);}});
    return ld;
  }

  get pendingSources(){
    if(this.dataConfig.sources === 'undefined'){return {};}
    return this.dataConfig.sources;
  }

  setHeader(header){
    this.header = header;
  }
  setAttribution(attribution){
    this.attribution = attribution;
  }
  setDataConfig(data){
    this.dataConfig = data;
  }

  initDataStore(url){
    fetch(url,{cache: 'no-cache'})
      .then(r => checkStatus(r, url))
      .then( r => r.json())
      .then(data =>{
        this.setHeader(data.header || 'cmap-js');
        this.setAttribution(data.attribution || '');
        this.setCanvasMaxHeight(data.canvasHeight || -1);
        this.setDataConfig(data);
      });
  }

  loadDataSource(dataSource){
    // Load each source as a promise to prevent blocking during data fetch.
    const loadPromise = new Promise((resolve,reject) => {
      const sourceStore = new SourceStore();
      sourceStore.setId(dataSource.id);
      sourceStore.setUrl(dataSource.url);
      sourceStore.setType(dataSource.type);
      if (dataSource.filters) {
        dataSource.filters.forEach(filter => sourceStore.addFilter(filter));
      }
      if (dataSource.linkouts) {
        dataSource.linkouts.forEach(linkout => sourceStore.addLinkout(linkout));
      }
      sourceStore.loadMaps();
      autorun( () => {
        if (sourceStore.loaded) {
          resolve(sourceStore);
        } if (sourceStore.errors.length > 0){
          reject(sourceStore.errors);
        }
      });
    });
    loadPromise
      .then(store => {
        if(store.type === 'manhattan'){
          this.manhattans[store.id] = store;
        } else {
          this.sources[store.id] = store;
        }
        if (store.errors.length > 0){this.errors.push(store.errors);}
      })
      .catch(e => this.errors.push(e));
  }

  setCanvasMaxHeight(height){
    this.canvasMaxHeight = height;
  }
}