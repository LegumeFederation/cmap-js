/**
 * MapStore
 * Mobex Store for managing a single Map, its configuration, and features
 */

import { makeObservable, observable, computed, action} from 'mobx';
import mergeObjects from '../../util/mergeObjects';

export default class MapStore {
  constructor() {
    makeObservable(this, {
      name: observable,
      source: observable,
      features: observable.shallow,
      taggedFeatures: observable,
      landmarks: observable,
      coordinates: observable,
      config: observable,
      length: computed,
      key:computed,
      tags: computed,
      setName: action,
      addFeature: action,
      addLandmark: action,
      addTag: action,
      setCoordinates: action,
      setConfig: action,
    });
  }
  //display name for this map
  name = '';
  //file source
  source = {
    id:'',
    method:'GET',
    url:'',
    config:'',
  };
  //biological features
  features = [];
  //features sorted by tags.
  taggedFeatures = {}
  //"landmark" features
  landmarks = [];
  //tags
  get tags() {
    return Object.keys(this.taggedFeatures);
    //let tags = [];
    //this.features.forEach(f => tags = [].concat.apply(tags,f.tags));
   // return tags.filter((tag, i, arr) => {return arr.indexOf(tag) === i;});
  }
  // beginning/end coordinates
  coordinates={
    start:0,
    end:0,
  }

  //configuration store
  //TODO: Determine if needed
  config = {}

  //computed length of feature
  get length(){
    return this.coordinates.stop - this.coordinates.start;
  }

  //return unique key
  get key(){
    return `${this.source.id}/${this.name}`;
  }
  setName(name){
    this.name = name;
  }

  addFeature(feature){
    feature.setLandmark(false);
    this.features.push(feature);
    feature.tags.forEach(tag => {
      if(!this.taggedFeatures[tag]){
        this.taggedFeatures[tag]=[];
      }
      this.taggedFeatures[tag].push(feature);
    });
  }

  addLandmark(landmark){
    landmark.setLandmark = true;
    this.landmarks.push(landmark);
    landmark.tags.forEach(tag => {
      if(!this.taggedFeatures[tag]){
        this.taggedFeatures[tag]=[];
      }
      this.taggedFeatures[tag].push(landmark);
    });
  }

  addTag(tag){
    this.tags.push(tag);
  }

  setCoordinates(coordinates){
    for(const key of Object.keys(coordinates)) {
      this.coordinates[key] = coordinates[key];
    }
  }

  setConfig(config){
    this.config = mergeObjects(this.config,config);
  }
  
}
