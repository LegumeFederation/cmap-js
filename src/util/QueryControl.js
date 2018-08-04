/**
 * @file
 * Singleton class for manipulating cmap through the query string.
 */

import qs from 'qs';


class QueryString {
  constructor(){

    let initialQuery = qs.parse(location.search,{ ignoreQueryPrefix: true, encode:false, strictNullHandling:true }) || {};
    this._data = [initialQuery];
  }

  get data(){
    return this._data[0];
  }

  get view(){
    let view = this._data[0].view || null;
    if(typeof view === 'string') view = [view];
    return view;
  }

  get zoom(){
    let zoom = this._data[0].zoom || null;
    if(typeof view === 'string') zoom = [zoom];
    return zoom;
  }

  get mapSet(){
    let mapSet = this._data[0].mapSet || null;
    if(typeof mapSet === 'string') mapSet = [mapSet];
    return mapSet;
  }

  update(appState){
    this._data.pop();
    let currentState = {view:[],mapSet:[],zoom:[]};
    appState.forEach(bioMap => {
      currentState.view.push(bioMap.name);
      currentState.mapSet.push(bioMap.source.id);
      if(bioMap.view && bioMap.view.base) {
        if (bioMap.view.visible.start === bioMap.view.base.start && bioMap.view.visible.stop == bioMap.view.base.stop) {
          currentState.zoom.push(bioMap.view.invert);
        } else {
          currentState.zoom.push([bioMap.view.visible.start, bioMap.view.visible.stop, bioMap.view.invert]);
        }
      }
    });
    let newString = qs.stringify(currentState,{addQueryPrefix:true, encode:false, strictNullHandling:true });
    history.replaceState({},'', newString);
    this._data.push(currentState);
  }

  stateFromQuery(appState){
    if (this.view) {
      let overrideInitialView = [];
      this.view.forEach((view, index) => {
        const filter = appState.allMaps.filter(map => map.name == view);
        if (filter.length) {
          if (this.mapSet && this.mapSet[index]) { //maps may not need a mapSet
            const mapMatch = filter.filter(map => map.source.id === this.mapSet[index]);
            if (mapMatch.length) {
              overrideInitialView.push(mapMatch[0]);
            }
          } else {
            overrideInitialView.push(filter[0]);
          }
        }
      });
      appState.bioMaps = overrideInitialView;
    }
    if(this.zoom){
     appState.bioMaps.forEach((map,index) => {
       let zoomState = this.zoom[index];
       if(!map.view)  map.view = {};
        if (typeof zoomState === 'string') {
          map.view.visible = {};
          map.view.invert = (zoomState == 'true');
        } else {
          map.view.visible = {
            start :zoomState[0],
            stop: zoomState[1]
          };
          map.view.invert = (zoomState[2] == 'true');
        }
      });
     console.log('iv zoom', appState.bioMaps);
    }
    this.update(appState.bioMaps);
    return appState;
  }
}


const instance = new QueryString();
Object.freeze(instance);

export default instance;