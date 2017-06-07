/**
    this.info.top = this.info.data.globalBounds.top;
    m.redraw();
  * BioMap
  *
  * SceneGraphNodeCanvas representing a biological map and its associated tracks
  *
  */
import m from 'mithril';

import {Bounds} from '../../model/Bounds';
import {SceneGraphNodeCanvas} from '../node/SceneGraphNodeCanvas';
import {MapTrack} from './MapTrack';
import {QtlTrack} from './QtlTrack';
import {Ruler} from '../geometry/Ruler';

export class BioMap extends SceneGraphNodeCanvas {

  constructor({bioMapModel, appState, layoutBounds}) {
    super({model:bioMapModel});
    this.model.visible = {
      start: this.model.coordinates.start,
      stop: this.model.coordinates.stop
    };
    this.model.view = {
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
    this.verticalScale = 0;
    this.backbone = null;
    this.featureMarks = [];
    this.featureLabels = [];
    this.info = {
      top:0,
      left:0,
      visible:'hidden'
    };

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
    console.warn('BioMap -> onZoom', evt);
    // normalise scroll delta
		this.verticalScale = evt.deltaY < 0 ? -0.5 : 0.5;
    let mcv = this.model.view.base;
    let zStart = (this.model.view.visible.start + this.verticalScale);
    let zStop = (this.model.view.visible.stop - this.verticalScale);
    if(zStop - zStart < .01){
      this.verticalScale -=0.5;
      return true;
    }
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
    this._redrawViewport({start:zStart,stop:zStop});    
    return true; // stop event propagation
  }

  _onTap(evt) {
    console.log('BioMap -> tap dat', evt, this);
    let globalPos = this._pageToCanvas(evt);
    this._loadHitMap();
    let hits = [];
		this.info.visible = 'hidden';
		this.info.top = globalPos.y;
		this.info.left = globalPos.x;
    this.hitMap.search({
      minX: globalPos.x,
      maxX: globalPos.x,
      minY: globalPos.y-2,
      maxY: globalPos.y+2
    }).forEach(hit => { 
      hits.push(hit.data);//.model.name,hit.data.model.coordinates.start]);
		});
    if(hits.length > 0){
			this.info.visible = 'true';
			this.info.top = hits[0].globalBounds.top;
			this.info.left = hits[0].globalBounds.right;
      this.info.data = hits;
			let names = hits.map(hit => { return hit.model.name; });
      this.info.innerHTML= `<p> ${names.join('\n')} <\p>`;
    }
		m.redraw();

    return true;
  }
	_onPanStart(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    this.zoomP = {};
    this.zoomP.pStart = true;
    console.warn('BioMap -> onPanStart -- vertically; implement me', evt);
    let globalPos = this._pageToCanvas(evt);
    let left = this.ruler.globalBounds.left - this.ruler.textWidth;
    // scroll view vs box select
    if(left < (globalPos.x-evt.deltaX) && 
      (globalPos.x-evt.deltaX) < (left+this.ruler.bounds.width)){
      this.zoomP.ruler = true;
      this.zoomP.delta = 0;
      this._moveRuler(evt);
    } else { 
      this.zoomP.ruler = false;
      this.zoomP.start = this._pixelToCoordinate(globalPos.y-this.ruler.globalBounds.top-evt.deltaY);
      if(this.zoomP.start < this.model.view.base.start){
        this.zoomP.start = this.model.view.base.start;
      }
      let ctx = this.context2d;
      this.zoomP.corner = {top:globalPos.y-evt.deltaY,left:globalPos.x-evt.deltaX};	
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(
        Math.floor(globalPos.x-evt.deltaX),
        Math.floor(globalPos.y-evt.deltaY),
        Math.floor(globalPos.x),
        Math.floor(globalPos.y)
      );
    }
    return true;
  }
  _moveRuler(evt){
    console.log('delta',evt.deltaY - this.zoomP.delta);
    let delta = (evt.deltaY - this.zoomP.delta) / this.model.view.pixelScaleFactor;
    if(this.model.view.visible.start+delta < this.model.view.base.start){
      delta = this.model.view.base.start - this.model.view.visible.start;
    } else if(this.model.view.visible.stop+delta > this.model.view.base.stop){
      delta = this.model.view.base.stop - this.model.view.visible.stop;
    }
    this.model.view.visible.start += delta;
    this.model.view.visible.stop += delta;
		this._redrawViewport({start:this.model.view.visible.start, stop:this.model.view.visible.stop});
    this.zoomP.delta = evt.deltaY;
  }
  _onPan(evt){
    // block propegation if pan hasn't started
    if (!this.zoomP || !this.zoomP.pStart) return true;
    if(this.zoomP && this.zoomP.ruler){
      let delta = evt.deltaY / this.model.view.pixelScaleFactor;
      console.log('pan delta',delta);
      this._moveRuler(evt);
    } else {
      let globalPos = this._pageToCanvas(evt);
			this.draw();
      let ctx = this.context2d;
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(
        Math.floor(this.zoomP.corner.left),
        Math.floor(this.zoomP.corner.top),
        Math.floor(globalPos.x - this.zoomP.corner.left),
        Math.floor(globalPos.y -this.zoomP.corner.top )
      );
    }
    return true;
  }
	_onPanEnd(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onPanEnd -- vertically; implement me', evt,this.model.view.base);
    // block propegation if pan hasn't started
    if (!this.zoomP || !this.zoomP.pStart) return true;
    if(this.zoomP && this.zoomP.ruler){
      let delta = evt.deltaY / this.model.view.pixelScaleFactor;
      console.log('pan delta',delta);
      this._moveRuler(evt);
    } else {
      let globalPos = this._pageToCanvas(evt);
      this.zoomP.stop = this._pixelToCoordinate(globalPos.y-this.ruler.globalBounds.top);
      
      if(this.zoomP.stop > this.model.view.base.stop){
        this.zoomP.stop = this.model.view.base.stop;
      }
      
      let zStart = this.zoomP.start <= this.zoomP.stop ? this.zoomP.start : this.zoomP.stop;
      let zStop = this.zoomP.stop >= this.zoomP.start ? this.zoomP.stop : this.zoomP.start;
      this._redrawViewport({start:zStart, stop:zStop});
    }
    this.zoomP.ruler = false;
    this.zoomP.pStart = false;
    return true; // do not stop propagation
	}
    /**
     *  Converts a pixel position to the  canvas' backbone coordinate system.
     *
     */	
  _pixelToCoordinate(point){
    let coord = this.model.view.base;
    let visc = this.model.view.visible;
    let psf = this.model.view.pixelScaleFactor;
    return (visc.start*(coord.stop*psf - point) + visc.stop*(point - coord.start* psf))/(psf*(coord.stop - coord.start));
  }

    /**
     * Convert point from page coordinates to canvas coordinates
     *
     */
  _pageToCanvas( evt ){
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
    return {
      'x': evt.srcEvent.pageX - pageOffset.left,
      'y': evt.srcEvent.pageY - pageOffset.top
    };
  }
  /**
   * perform layout of backbone, feature markers, and feature labels.
   */
  
  _layout(layoutBounds) {
    // TODO: calculate width based on # of SNPs in layout, and width of feature
    // labels
    // Setup Canvas
    //const width = Math.floor(100 + Math.random() * 200);
    console.log('BioMap -> layout');
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
    this.model.view.backbone = this.backbone.backbone.globalBounds;
    this.ruler = new Ruler({parent:this, bioMap:this.model});
    this.children.push(this.ruler);
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
    this.locMap.clear();// = rbush();
    this.locMap.load(hits);
  }

  _redrawViewport(coordinates){
    this.model.view.visible = {
      start: coordinates.start,
      stop: coordinates.stop
    };
    this.backbone.loadLabelMap();
    this.draw();
    
    let cMaps = document.getElementsByClassName('cmap-correspondence-map');
    [].forEach.call(cMaps, el =>{
      el.mithrilComponent.draw();
    });
    // move top of popover if currently visible
    if(this.info.visible !== 'hidden'){
      this.info.top = this.info.data[0].globalBounds.top;
    }
    m.redraw();
  }
}
