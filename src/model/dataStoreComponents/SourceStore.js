/**
 * SourceStore
 * MobexStore for managing a single source and its maps and source-specific configurations.
 */

import { makeObservable, observable, action} from 'mobx';
import {defaultConfig} from './DefaultConfig';
import checkStatus from '../../util/fetch';
import {deserializeCSV} from './readFile';
import MapStore from './MapStore';
import FeatureStore from './FeatureStore';
import mergeObjects from '../../util/mergeObjects';

export default class SourceStore {
  constructor() {
    makeObservable(this, {
      id: observable,
      method: observable,
      url: observable,
      config: observable,
      type: observable,
      maps: observable.struct,
      filters:observable,
      linkouts: observable,
      loaded: observable,
      errors: observable,
      setId: action,
      setMethod: action,
      setConfig: action,
      addLinkout: action,
      setUrl: action,
      setType: action,
      addFilter: action,
      addError: action,
      loadMaps: action,
      toggleLoaded: action,
    });
  }

  id = '';
  method = 'GET';
  url = '';
  config = mergeObjects({}, defaultConfig);
  type = 'bioMap';
  maps = {};
  filters = [];
  linkouts = [];
  loaded = false;
  errors = [];

  setId(id){
    this.id = id;
  }
  setMethod(method){
    this.method = method;
  }

  setUrl(url){
    this.url = url;
  }

  setConfig(config){
    for(const key of Object.keys(config)){
      mergeObjects(this.config,config[key]);
    }
  }

  setType(type){
    if(type !== undefined){
      this.type = type;
    }
  }

  appendMap(map) {
    this.maps[map.key] = map;
  }


  loadMaps(){
    //TODO: deal with Manhattan
    fetch(this.url,{method:this.method})
      .then(r => checkStatus(r, this.url))
      .then(r => r.text())
      .then(data => {
        let parsed = deserializeCSV(data,this.url);
        if(parsed.errors.length){
          throw new Error(`There were parsing errors in ${this.url} please see console.`);
        }
        const coordinates = {};
        parsed.data.forEach((feature) => {
          try {
            //don't process feature if not part of filtered map-set
            if(this.filters.length > 0 && this.filters.indexOf(feature['map_name']) === -1){
              return;
            }
            const uniqName = `${this.id}/${feature['map_name']}`;
            // Add new map if map isn't already in source store
            if( this.maps[uniqName] === undefined){
              const newMap = new MapStore();
              newMap.setName(feature['map_name']);
              newMap.setCoordinates({start:feature['map_start'], stop:feature['map_stop']});
              newMap.source = {id:this.id, url:this.url};
              coordinates[uniqName] = newMap.coordinates;
              //TODO: Add map specific config
              //TODO: add landmarks
              this.appendMap(newMap);
            }
            //add feature to map
            const newFeature = new FeatureStore();
            const typeField = feature['feature_type'] !== undefined ? 'feature_type' : 'feature_type_acc';
            const aliases = feature['feature_aliases'] !== null && feature['feature_aliases'] !== undefined ?
              feature['feature_aliases'].split(',') : [];
            newFeature.loadFeature(//
              this.maps[uniqName].key,
              {start: feature['feature_start'], stop: feature['feature_stop']},
              feature['feature_name'],
              [feature[typeField] !== '' ? feature[typeField] : null],
              aliases,
              feature
            );
            //Track start/stop of features
            if( feature['feature_start'] < coordinates[uniqName].start){
              coordinates[uniqName].start = feature['feature_start'];
            }
            if( feature['feature_stop'] > coordinates[uniqName].stop){
              coordinates[uniqName].stop = feature['feature_stop'];
            }
            this.maps[uniqName].addFeature(newFeature);
          } catch(e){ this.addError(e);}
        });
        Object.keys(coordinates).forEach((key) =>{
         this.maps[key].setCoordinates(coordinates[key]);
        });
        //After all maps loaded, update status
        this.toggleLoaded();
      })
    .catch(e => this.addError(e));
  }

  addError(error){
    this.errors.push(error);
  }
  addFilter(filter){
    this.filters.push(filter);
  }
  addLinkout(linkout){
    linkout.featuretypePattern !== undefined ? linkout.featuretypePattern = new RegExp(linkout.featuretypePattern) : undefined;
    this.linkouts.push(linkout);
  }

  toggleLoaded(){
    this.loaded = !this.loaded;
  }
}