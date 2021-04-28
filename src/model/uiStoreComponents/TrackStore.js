/**
 * TrackStore
 * Mobex Store for managing a sub-track in a displayed BioMap.
 */

import { makeObservable, observable, computed, action} from 'mobx';
import mergeObjects from '../../util/mergeObjects';

export default class TrackStore {
  constructor(bioMap,title = '', filters =[], colors=[]) {
    this.bioMap = bioMap;
    this.key = encodeURIComponent(title);
    this.title = title;
    this.filters = filters;
    this.colors = colors;

    makeObservable(this, {
      title: observable,
      key: observable,
      filters: observable,
      colors: observable,
      bioMap: observable,
      canvasElement: observable,
      canvasGroup: observable,
      config: computed,
      bounds: computed,
      updateColors: action,
      updateFilters: action,
      updateTitle: action,
      editSettings:action,
      removeTrack: action,
    });
  }

  canvasElement = {};
  canvasGroup = {};

  get bounds(){
    if(this.canvasElement){
      return this.canvasElement.canvasBounds;
    } else {
      return undefined;
    }
  }

  get config(){
    let conf = {
      track: this.bioMap.config.track,
      qtl: this.bioMap.config.qtl,
    };
    if(this.bioMap.config[this.key]){
      mergeObjects(conf.qtl,this.bioMap.config[this.key]);
    }
    conf.qtl.filters = this.filters;
    conf.qtl.fillColor = this.colors;
    return conf;
  }

  updateTitle(title){
    this.title = title;
  }
  updateFilters(filters){
    this.filters = filters;
  }
  updateColors(colors){
    this.colors = colors;
  }
  setCanvasElement(track){
    this.canvasElement = track;
    this.canvasGroup = track.parent;
  }

  editSettings(title=this.title, filters=this.filters, colors=this.colors){
    this.title = title;
    this.filters = filters;
    this.colors = colors;
    const sg = this.bioMap.sceneGraph;
    if(Object.keys(sg.namedChildren['lhst'].namedChildren).indexOf(this.key) !== -1){
      sg.namedChildren['lhst'].namedChildren[this.key].updateTrack(this.config);
    } else {
      sg.namedChildren['rhst'].namedChildren[this.key].updateTrack(this.config);
    }
    this.bioMap.updateTracks(this.key,this);
  }

  removeTrack(){
    const sg = this.bioMap.sceneGraph;
    if(Object.keys(sg.namedChildren['lhst'].namedChildren).indexOf(this.key) !== -1){
      this.bioMap.removeTrack(this.key,0);
    } else {
      this.bioMap.removeTrack(this.key,1);
    }
  }
}