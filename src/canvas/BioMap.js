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
  _onPanStart(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
      console.warn('BioMap -> onPanStart -- vertically; implement me', evt);
			this.zoomP = {};
			this.zoomP.start = this.pToM(evt.srcEvent.layerY);
   	if(this.zoomP.start < this.mapCoordinates.base.start) this.zoomP.start = this.mapCoordinates.base.start; 
      return true;
  }
  _onPanEnd(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onPanEnd -- vertically; implement me', evt);
		this.zoomP.stop = this.pToM(evt.srcEvent.layerY);
   	if(this.zoomP.stop > this.mapCoordinates.base.stop) this.zoomP.stop = this.mapCoordinates.base.stop; 
		this.mapCoordinates.visible = {
      start: this.zoomP.start,
      stop: this.zoomP.stop
    };
    this.draw();

    
    let cMaps = document.getElementsByClassName('cmap-correspondence-map');
    [].forEach.call(cMaps, el =>{
      el.mithrilComponent.draw();
    });
    return true; // do not stop propagation
  }
  
  pToM(point){
	  let coord = this.mapCoordinates.base;
    let visc = this.mapCoordinates.visible;	
    let psf = this.backbone.labelGroup.children[0].pixelScaleFactor;
    return (visc.start*(coord.stop*psf - point) + visc.stop*(point - coord.start* psf))/(psf*(coord.stop - coord.start));  
  }
  _onZoom(evt) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onZoom', evt);
    // normalise scroll delta
		this.verticalScale += evt.deltaY < 0 ? 0.5 : -0.5;
    if(this.verticalScale <= 0) this.verticalScale = 0.0;
    let mcv = this.mapCoordinates.base;
    let zStart = (mcv.start + this.verticalScale);
    let zStop = (mcv.stop - this.verticalScale);
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
      el.mithrilComponent.draw();
    });
    return true; // stop event propagation
  }

  _onTap(evt) {
    console.log('BioMap -> tap', evt);
		function getOffset( el ) {
      var _x = 0;
      var _y = 0;
      while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }
      return { top: _y, left: _x };
    }
		let pageOffset = getOffset(this.canvas);
		let globalPos = {
			'x': evt.srcEvent.pageX - pageOffset.left,
			'y': evt.srcEvent.pageY - pageOffset.top
		};


    m.redraw();
    this._loadHitMap();
    let hits = [];
    this.hitMap.search({
      minX: globalPos.x,
      maxX: globalPos.x,
      minY: globalPos.y-2,
      maxY: globalPos.y+2
    }).forEach(hit => { 
      hits.push(hit.data.model.name);});
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
    console.log('BioMap -> layout');
    // Setup Canvas
    //const width = Math.floor(100 + Math.random() * 200);
    const width = 550;
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
    childrenHits.forEach(child =>{
      hits = hits.concat(child);
    });
    this.locMap = rbush();
    this.locMap.load(hits);
  }
}
