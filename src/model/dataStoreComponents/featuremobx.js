/**
 * Featuremobx
 * MobexStore for managing individual map features.
 */

import { makeObservable, observable, action} from 'mobx';

export default class Featuremobx {
  constructor() {
    makeObservable(this, {
      source: observable.ref,
      coordinates: observable.ref,
      name: observable.ref,
      tags: observable.ref,
      aliases: observable.ref,
      data: observable.ref,
      isLandmark: observable,
      loadFeature: action,
      setLandmark:action,
    });
  }

  source = '';
  coordinates = {
    start: 0,
    stop: 0,
  }
  name = '';
  tags = [];
  aliases = [];
  data = {};
  isLandmark= false;

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
}

