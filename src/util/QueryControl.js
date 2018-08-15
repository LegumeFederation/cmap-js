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
    if(!appState.bioMapOrder){ //initialize default bioMapOrder
      appState.bioMapOrder = [];
      for(let i = 0; i < appState.bioMaps.length; i++){
        appState.bioMapOrder[i] = i;
      }
    }
    appState.bioMapOrder.forEach(bioMapIndex => {
      let bioMap = appState.bioMaps[bioMapIndex];
      currentState.view.push(bioMap.name);
      currentState.mapSet.push(bioMap.source.id);
      if(bioMap.view && bioMap.view.base) {
        let zoom = bioMap.view.invert ? `${bioMap.view.visible.stop}..${bioMap.view.visible.start}` : `${bioMap.view.visible.start}..${bioMap.view.visible.stop}`;
        currentState.zoom.push(zoom);
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
       let zoomState = this.zoom[index].split('..');
       zoomState[0] = parseInt(zoomState[0]);
       zoomState[1] = parseInt(zoomState[1]);
       if(!map.view)  map.view = {};
       if ( zoomState[0] < zoomState[1]) {
          map.view.visible = {
            start:zoomState[0],
            stop:zoomState[1]
          };
          map.view.invert = false;
        } else {
          map.view.visible = {
            start : zoomState[1],
            stop: zoomState[0]
          };
          map.view.invert = true;
        }
      });
    }
    this.update(appState);
    return appState;
  }
}


const instance = new QueryString();
Object.freeze(instance);

export default instance;