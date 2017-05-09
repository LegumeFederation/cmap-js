/**
  * BioMap
  *
  * SceneGraphNodeCanvas representing a biological map and its associated tracks
  *
  */
import m from 'mithril';
import rbush from 'rbush';

import {Bounds} from '../model/Bounds';
import {SceneGraphNodeCanvas} from './SceneGraphNodeCanvas';
import {MapTrack} from './MapTrack';
import {selectedMap} from '../topics';

export class BioMap extends SceneGraphNodeCanvas {

  constructor({bioMapModel, appState, layoutBounds}) {
    super({model:bioMapModel});
    this.model.visible = {
      start: this.model.coordinates.start,
      stop: this.model.coordinates.stop
    };
    this.mapCoordinates = {
      base: {
        start: this.model.coordinates.start,
        stop: this.model.coordinates.stop
      },
      visible: {
        start: this.model.coordinates.start,
        stop: this.model.coordinates.stop
      }
    };
    // set up coordinate bounds for view scaling
    this.appState = appState;
    this.verticalScale = 1;
    this.backbone = null;
    this.featureMarks = [];
    this.featureLabels = [];
    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
    this._layout(layoutBounds);
  }

  /**
   * 
   * Re-implement lifecycle/gestrue components as needed to appease 
   * the items on the canvas. 
   *
   */


  _onZoom(evt) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onZoom -- implement me', evt);
    this.verticalScale -= evt.deltaY;
    let mcv = this.mapCoordinates.base;
    let zStart = (mcv.start - this.verticalScale*.1);
    let zStop = (mcv.stop + this.verticalScale*.1);
    zStart = zStart < mcv.start ? mcv.start : zStart;
    zStop = zStop > mcv.stop ? mcv.stop : zStop;
    this.mapCoordinates.visible = {
      start: zStart,
      stop: zStop
    };
    this.draw();

    //redraw all correspondence maps, could technically do some magic with
    //appending a specific class to correspondence maps based on which maps a
    //biomap is attached to, but with potential circos layout, it is more sane
    //to just redraw them all.
    
    let cMaps = document.getElementsByClassName('cmap-correspondence-map');
    [].forEach.call(cMaps, el =>{
      console.log(el);
      el.mithrilComponent.draw();
    });
    return true; // stop event propagation
  }
  _onTap(evt) {
    console.log('tap');
    console.log(evt);
    let sel = this.appState.selection.bioMaps;
    let i = sel.indexOf(this);
    if(i === -1) {
      sel.push(this);
    }
    else {
      sel.splice(i, 1);
    }
    m.redraw();
    this._loadHitMap();
    let hits = [];
    this.hitMap.search(
      {minX: evt.srcEvent.layerX,
       maxX: evt.srcEvent.layerX,
       minY: evt.srcEvent.layerY-5,
       maxY: evt.srcEvent.layerY+5
      }).forEach(hit => { hits.push(hit.data.model.name)});
    console.log(hits);
    if(hits.length > 0){
      window.alert( hits.join(' , '));
    };

    PubSub.publish(selectedMap, {
      evt: evt,
      data: this.appState.selection.bioMaps
    });
    return true;
  }
  /**
   * perform layout of backbone, feature markers, and feature labels.
   */
  
  
  _layout(layoutBounds) {
    // TODO: calculate width based on # of SNPs in layout, and width of feature
    // labels
    console.log('layout BioMap');
    // Setup Canvas
    //const width = Math.floor(100 + Math.random() * 200);
    const width = 500;
    this.children = [];
    this.domBounds = new Bounds({
      left: layoutBounds.left,
      top: layoutBounds.top,
      width: width,
      height: layoutBounds.height
    });
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
    //Add children tracks
    this.backbone = new MapTrack({parent:this});
    this.children.push(this.backbone);

    // load local rBush tree for hit detection
    this._loadHitMap();
  }
  
  get visible(){
    let vis = [];
    let cVis = this.children.map(child => {
      return child.visible;
    });
    cVis.forEach(item => {
      vis = vis.concat(item);
    });
    return vis;
  }

  get hitMap(){
    return this.locMap;
  }

  _loadHitMap(){
    let hits = [];
    let childrenHits = this.children.map(child => {
      return child.hitMap;
    });
    console.log('loading', childrenHits);
    childrenHits.forEach(child =>{
      hits = hits.concat(child);
    });
    this.locMap = rbush();
    this.locMap.load(hits);
  }
}
