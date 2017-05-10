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
import {QtlTrack} from './QtlTrack';

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
   * culls elements to draw down to only those visible within the view 
   * bounds
   */
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
  /**
   * children.visible() culls hits based on map coordiantes
   * the hitMap is based on canvas global coordinates.
   * */
  get hitMap(){
    return this.locMap;
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
    // normalise scroll delta
    this.verticalScale -= evt.deltaY < 0 ? -0.5 : 0.5;
    let mcv = this.mapCoordinates.base;
    let zStart = (mcv.start - this.verticalScale);
    let zStop = (mcv.stop + this.verticalScale);
    if(zStart < mcv.start) {
      zStart = mcv.start; 
    } else if ( zStart > zStop ){
      zStart = zStop;
    }
    
    if(zStop > mcv.stop) {
      zStop = mcv.stop; 
    } else if ( zStop < zStart ){
      zStop = zStart;
    }
    
    this.mapCoordinates.visible = {
      start: zStart,
      stop: zStop
    };
    this.draw();

    
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
    m.redraw();
    this._loadHitMap();
    let hits = [];
    this.hitMap.search({
      minX: evt.calcEvent.x,
      maxX: evt.calcEvent.x,
      minY: evt.calcEvent.y-2,
      maxY: evt.calcEvent.y+2
    }).forEach(hit => { 
      console.log(hit);
      hits.push(hit.data.model.name);});
    console.log(evt.srcEvent);
    if(hits.length > 0){
      window.alert( hits.join('\n'));
    }

    return true;
  }

  /**
   * perform layout of backbone, feature markers, and feature labels.
   */
  
  _layout(layoutBounds) {
    // TODO: calculate width based on # of SNPs in layout, and width of feature
    // labels
    console.log('layout BioMap');
    console.log(this.vnode);
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
    let qtl  = new QtlTrack({parent:this});
    this.children.push(qtl);
    // load local rBush tree for hit detection
    this._loadHitMap();
    m.redraw();
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
    console.log(this.locMap.all());
  }
}
