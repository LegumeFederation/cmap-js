/**
 * Featuremobx
 * MobexStore for managing individual map features.
 */

//import { makeObservable, observable, action} from 'mobx';

export default class FeatureStore {
  constructor() {
    this.source = '';
    this.coordinates = {
      start: 0,
      stop: 0,
    };
    this.name = '';
    this.tags = [];
    this.aliases = [];
    this.data = {};
    this.isLandmark = false;
  }

  loadFeature(source, coordinates, name, tags, aliases,data){
    this.source = source;
    this.name = name;
    this.coordinates = coordinates;
    this.tags = tags;
    this.aliases = aliases;
    this.data = data;
  }

  setLandmark(status){
    this.isLandmark = status;
  }

  get length(){
    return this.coordinates.stop - this.coordinates.start;
  }
}

