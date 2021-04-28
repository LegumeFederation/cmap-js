/**
 * BioMapStore
 * Mobex Store for managing a single drawn Map and it's sub-tracks.
 */
import { h } from 'preact';
import {makeObservable, observable, computed, action, autorun} from 'mobx';
import mergeObjects from '../../util/mergeObjects';
import {Bounds} from '../Bounds';
import {SceneGraphNodeCanvas} from '../../canvas/node/SceneGraphNodeCanvas';
import {HitDot} from '../../canvas/geometry/HitDot';
import {MapTrack} from '../../canvas/layout/MapTrack';
import {SceneGraphNodeGroup} from '../../canvas/node/SceneGraphNodeGroup';
import {SelectBox} from '../../canvas/geometry/SelectBox';
import TrackStore from './TrackStore';
import {FeatureTrack} from '../../canvas/layout/FeatureTrack';
import {remToPix} from '../../util/CanvasUtil';

export default class BioMapStore {
  constructor(uiStore) {
    this.uiStore = uiStore;
    makeObservable(this, {
      bioMap: observable,
      sourceName: observable,
      canvas: observable,
      context: observable,
      sceneGraph: observable,
      bounds: computed, // observable.deep,
      dirty: observable,
      correspondenceMaps: observable,
      activeCorrespondence: observable,
      viewBase: observable,
      viewVisible: observable,
      pixelScaleFactor: observable,
      config: observable,
      canvasMax: observable,
      tracks:observable,
      trackOrder:observable,
      uiStore: observable,
      panState: observable,
      panPrior: observable,
      popoverContents: observable,
      actualBounds: computed,
      order : observable,
      modal: observable,
      leftNeighbor: computed,
      rightNeighbor: computed,
      view: computed,
      initMap: action,
      setCanvas:action,
      initScenegraph: action,
      updateBounds: action,
      updateCanvasBounds: action,
      setPixelScaleFactor:action,
      draw: action,
      canvasBounds: computed,
      updateOrder: action,
      zoomMap: action,
      panStart: action,
      onPan: action,
      panEnd: action,
      clearPopoverContents: action,
      clickHits: action,
      setModal: action,
      addTrack: action,
      shiftMajorGroups: action,
      updateTracks: action,
      removeTrack: action,
    });
  }

  /**
   * Mobex store containing map data
   * @type {{}}
   */
  bioMap = {};
  /**
   * Display name of map's source
   * @type {string}
   */
  sourceName = '';
  /**
   * Active canvas
   * @type {html.canvas}
   */
  canvas = undefined;
  context = undefined;
  config = {};
  uiStore = {};
  order = 0;
  panState = '';
  panPrior = 0;
  popoverContents = [];
  //bounds = new Bounds({top:0, left:0});
 // bounds = {};
  get bounds(){
    return new Bounds({
      left: 0,
      top: 40,
      width: this.canvas ? this.canvas.width : 200,
      height: this.uiStore.canvasHeight,
    });
  }
  tracks = {};

  trackOrder = {left:[], right:[]};


  dirty = false;

  correspondenceMaps = {};

  activeCorrespondence = [];

  viewBase = {
    start:0,
    stop:0
  };

  viewVisible = {
    start:0,
    stop:0,
    invert: false,
  };

  pixelScaleFactor = 1;

  canvasMax = -1;
  /**
   *
   * @type {SceneGraphNodeCanvas}
   */
  sceneGraph = undefined;
  modal = ''

  get actualBounds(){
    if(this.canvas) {
      return this.canvas.getBoundingClientRect();
    }
    return {};
  }

  get canvasBounds(){
    return this.bounds;
  }

  get leftNeighbor(){
    return this.order > 0 ? this.uiStore.mapOrder[this.order-1] : null;
  }

  get rightNeighbor(){
    return this.order < this.uiStore.mapOrder.length-1 ? this.uiStore.mapOrder[this.order+1] : null;
  }

  get length(){
    return this.view.base.stop - this.view.base.start;
  }

  get view(){
    return {
      base: this.viewBase,
      visible: this.viewVisible,
      pixelScaleFactor: this.pixelScaleFactor,
    };
  }

  toggleDirty(){
    this.dirty = !this.dirty;
  }

  initMap(map){
    this.bioMap = map;
    let keys = this.bioMap.key.split('/');
    // set initial configuration
    this.config = mergeObjects(this.uiStore.dataStore.config,this.uiStore.dataStore.sources[keys[0]].config,this.bioMap.config);
    //init view with actual numbers
    this.viewBase = this.bioMap.coordinates;
    this.updateVisible(this.viewBase);
    this.order = this.uiStore.mapOrder.indexOf[this.bioMap.key];
  }

  updateBounds(){
  //    this.bounds.height = this.canvas.height;
  //    this.bounds.width = this.canvas.width;
    if(this.sceneGraph){
      this.sceneGraph.updateBounds(this.bounds);
      this.shiftMajorGroups();
    }
    this.dirty = true; //Canvas size has updated, redraw to fit.
  }

  updateCanvasBounds(){
    this.canvas.height = this.bounds.height;
    this.canvas.width = this.bounds.width;
    if(this.sceneGraph){
      this.sceneGraph.updateBounds(this.bounds);
      this.shiftMajorGroups();
    }
    this.dirty = true; //Canvas size has updated, redraw to fit.
  }

  updateVisible(view){
    this.viewVisible = mergeObjects(this.viewVisible,JSON.parse(JSON.stringify(view)));
    if(this.sceneGraph){ //update sceneGraph view if applicable
      //this.sceneGraph.updateView(this.view);
      this.draw();
    }
  }

  setBaseConfig(defaultConfig, storeConfig){
    this.baseConfig = mergeObjects(defaultConfig, storeConfig, this.bioMap.config);
  }

  setCanvas(canvas){
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  initScenegraph(){
    // Setup Canvas as "root" of the scene graph
    const sgc = new SceneGraphNodeCanvas({
      stateStore: this,
    });

    this.sceneGraph = sgc;
    this.updateBounds(this.bounds);

    // Setup map Backbone and Ruler
    const bb = new MapTrack({
      data:this.bioMap,
      parent: sgc
    });

    sgc.addChild(bb, 'backbone');

    // Setup left-hand Tracks
    const lhst = new SceneGraphNodeGroup({parent:this.sceneGraph});
    lhst.bounds = new Bounds({
      top: bb.bounds.top,
      bottom: bb.bounds.bottom,
      left: remToPix(3),
      right: bb.bounds.left - this.config.track.padding,
    });
    sgc.addChild(lhst, 'lhst');

    // Setup right-hand Tracks
    const rhst = new SceneGraphNodeGroup({parent:this.sceneGraph});
    rhst.bounds = new Bounds({
      top: bb.bounds.top,
      bottom: bb.bounds.bottom,
      left: bb.bounds.right+this.config.track.padding,
      right: this.sceneGraph.bounds.right - remToPix(3),
    });
    sgc.addChild(rhst, 'rhst');
    this.shiftMajorGroups();
    //Update bounds when window changes in dimensions and a set height isn't provided
    autorun(() => {
      this.updateBounds(this.bounds);
    });
  }

  draw(){
    this.sceneGraph.draw();
    this.dirty = false;
  }

  setPixelScaleFactor(psf){
    this.pixelScaleFactor = psf;
    if(this.sceneGraph) this.draw();
  }
  updateOrder(idx){
    this.order = idx;
  }
  // Respond to scroll event
  zoomMap(d){
    // (don't scale the canvas element itself)
    // normalise scroll delta
    let zd = (this.view.base.stop - this.view.base.start) / this.config.ruler.steps;
    let delta = d < 0 ? -zd : zd;
    let mcv = this.view.base;
    let zStart = (this.view.visible.start + delta);
    let zStop = (this.view.visible.stop - delta);
    if (zStop - zStart < .01) {
   //   delta -= 0.5;
      return true;
    }

    if (zStart < mcv.start) {
      zStart = mcv.start;
    } else if (zStart > zStop) {
      zStart = zStop;
    }

    if (zStop > mcv.stop) {
      zStop = mcv.stop;
    } else if (zStop < zStart) {
      zStop = zStart;
    }
    this.updateVisible( {
      start: zStart,
      stop: zStop
    });
    this.panPrior = 0;
    //autorun on view in initScenegraph will redraw.
  }

  //respond to click event
  clickHits(coordinates){
    if(!this.sceneGraph){
      return;
    } else if(this.sceneGraph.namedChildren['hitMarker']){
      this.sceneGraph.namedChildren['hitMarker'].position = coordinates;
    } else {
      const hitMarker = new HitDot({parent:this.sceneGraph, position:coordinates, radius:4});
      this.sceneGraph.addChild(hitMarker, 'hitMarker');
    }
    this.popoverContents = this.sceneGraph.calculateHits({
            minX: coordinates.x-4,
            maxX: coordinates.x+4,
            minY: coordinates.y-4, //this.sceneGraph.pixelToCoordinate(coordinates.y - this.sceneGraph.namedChildren['backbone'].canvasBounds.top - 4),
            maxY: coordinates.y+4,//this.sceneGraph.pixelToCoordinate(coordinates.y - this.sceneGraph.namedChildren['backbone'].canvasBounds.top + 4),
    }).filter(hit => {return Object.keys(hit.data).indexOf('model') !== -1;});
    this.draw();
  }

  panStart(coordinates){
    let rulerBounds = this.sceneGraph.namedChildren['backbone'].namedChildren['ruler'].canvasBounds;
    let rbx = coordinates.x >= rulerBounds.left && coordinates.x <= rulerBounds.right;
    let rby = coordinates.y >= rulerBounds.top && coordinates.y <= rulerBounds.bottom;
    if (rbx && rby) {
      this.panState = 'panRuler';
    } else {
      this.panState = 'boxSelect';
      let sb = new SelectBox({parent:this.sceneGraph,position:coordinates});
      this.sceneGraph.addChild(sb,'selectBox');
    }
    if(this.sceneGraph.namedChildren['hitMarker']){
      this.sceneGraph.namedChildren['hitMarker'].position = coordinates;
    } else {
      const hitMarker = new HitDot({parent:this.sceneGraph, position:coordinates, radius:4});
      this.sceneGraph.addChild(hitMarker, 'hitMarker');
    }
    this.draw();
  }

  onPan({position, delta = {x: 0, y: 0}}) {
    if (this.panState === 'boxSelect') {
      this.sceneGraph.namedChildren['selectBox'].updatePosition(position);
    }
    if (this.panState === 'panRuler') {
      if (this.view.invert) {
        delta.y = -delta.y;
      }
      let scaleDelta = (delta.y - this.panPrior)/this.pixelScaleFactor;
      // prevent moving off top/bottom of ruler range
      if (this.view.visible.start + scaleDelta < this.view.base.start) {
        scaleDelta = this.view.base.start - this.view.visible.start;
      } else if (this.view.visible.stop + scaleDelta > this.view.base.stop) {
        scaleDelta = this.view.base.stop - this.view.visible.stop;
      }
      this.updateVisible({
        start: this.view.visible.start + scaleDelta,
        stop: this.view.visible.stop + scaleDelta
      });
      this.panPrior = delta.y;
    }
    this.draw();
  }

  panEnd(position){
    if(this.panState === 'boxSelect') {
      this.onPan({position: position});
      //Determine if select box or zoom box
      let selectBox = this.sceneGraph.namedChildren['selectBox'];
      let rcb = this.sceneGraph.namedChildren['backbone'].namedChildren['ruler'].canvasBounds;
      let scb = selectBox.bounds;
      let lCorner = scb.left < scb.right ? scb.left : scb.right;
      let rCorner = scb.right > scb.left ? scb.right : scb.left;
      // if zoom rectangle contains the ruler, zoom, else populate popover
      if (((lCorner <= rcb.left) && (rCorner >= rcb.left)) || ((lCorner <= rcb.right && rCorner >= rcb.right))) {
        let y1 = scb.top > rcb.top ? scb.top : rcb.top;
        let y2 = scb.bottom < rcb.bottom ? scb.bottom : rcb.bottom;
        let newStart = y1 < y2 ? y1 -rcb.top : y2-rcb.top;
        let newStop = y1 < y2 ? y2-rcb.top : y1-rcb.top;
        this.updateVisible({
          start: (newStart)/this.pixelScaleFactor,
          stop: (newStop)/this.pixelScaleFactor
        });
        this.sceneGraph.updateView(this.view);
      } else {
        scb = selectBox.canvasBounds;
        let left = scb.left <= scb.right;
        let top = scb.top <= scb.bottom;
        this.popoverContents = this.sceneGraph.calculateHits({
          minX: left ? scb.left : scb.right ,
          maxX: left ? scb.right : scb.left,
          minY: top ? scb.top-rcb.top : scb.bottom-rcb.top, //this.sceneGraph.pixelToCoordinate(coordinates.y - this.sceneGraph.namedChildren['backbone'].canvasBounds.top - 4),
          maxY: top ? scb.bottom-rcb.top : scb.top-rcb.top,//this.sceneGraph.pixelToCoordinate(coordinates.y - this.sceneGraph.namedChildren['backbone'].canvasBounds.top + 4),
        }).filter(hit => {return Object.keys(hit.data).indexOf('model') !== -1;});
      }
      this.sceneGraph.removeChild(selectBox,'selectBox');
    }
    this.panState = '';
    this.panPrior = 0;
    this.draw();
  }
  clearPopoverContents(){
    this.popoverContents = [];
  }

  setModal(modal){
      this.modal = modal;
  }

  addTrack(direction,title,filters,colors){
    let existingKeys = Object.keys(this.tracks);
    if(existingKeys.indexOf(title) !== -1){
      title += existingKeys.length-1;
    }
    const leftTrackGroup = this.sceneGraph.namedChildren['lhst'];
    const rightTrackGroup = this.sceneGraph.namedChildren['rhst'];
    const track = new TrackStore(this, title, filters, colors);
    this.tracks[track.key] = track;
    let canvasGroup = rightTrackGroup;
    if(direction){
      this.trackOrder.right.push(track.key);
    } else {
      this.trackOrder.left.push(track.key);
      canvasGroup = leftTrackGroup;
    }
    const canvasTrack = new FeatureTrack({parent:canvasGroup, trackInfo: track, direction: direction, model:this.bioMap});
    canvasGroup.addChild(canvasTrack,track.key);
    track.setCanvasElement(canvasTrack);

    //shift if bounds are too bounded
    this.shiftMajorGroups();

    //redraw canvas
    this.draw();

  }

  shiftMajorGroups(){
    //shift if bounds are too bounded
    const leftTrackGroup = this.sceneGraph.namedChildren['lhst'] || undefined;
    const rightTrackGroup = this.sceneGraph.namedChildren['rhst'] || undefined;
    const backbone = this.sceneGraph.namedChildren['backbone'];
    const padding = this.config.track.padding;
    if(leftTrackGroup !== undefined){// && ((leftTrackGroup.canvasBounds.right +padding) >= backbone.canvasBounds.left)){
      const offset = (leftTrackGroup.canvasBounds.right + padding) - backbone.canvasBounds.left;
      backbone.bounds.translate(offset,0);
      leftTrackGroup.bounds.height = backbone.bounds.height;
    }
    if(rightTrackGroup !== undefined) {
      //if ((backbone.canvasBounds.right + padding) >= rightTrackGroup.canvasBounds.left) {
        const offset = (backbone.canvasBounds.right + padding) - rightTrackGroup.canvasBounds.left;
        rightTrackGroup.bounds.translate(offset, 0);
        rightTrackGroup.bounds.height = backbone.bounds.height;
      //}
      this.sceneGraph.updateWidth(rightTrackGroup.canvasBounds.right + padding);
    }
    this.uiStore.updateWidth();
  }

  updateTracks(key,track){
    this.tracks[key] = track;
    this.shiftMajorGroups();
    this.draw();
  }

  removeTrack(key,direction){
    if(direction){
      let side = this.sceneGraph.namedChildren['rhst'];
      side.removeChild(side.namedChildren[key],key);
      let idx = this.trackOrder.right.indexOf(key);
      this.trackOrder.right.splice(idx,1);
      this.trackOrder.right.forEach((track,idx) => {
        if(idx === 0){
         side.namedChildren[track].bounds.translate(-side.namedChildren[track].bounds.left ,0);
        } else {
          side.namedChildren[track].bounds.translate(side.namedChildren[this.trackOrder.right[idx-1]].canvasBounds.right - side.namedChildren[track].canvasBounds.left,0);
        }
      });
      if(this.trackOrder.right.length)
      side.bounds.width = side.namedChildren[this.trackOrder.right[this.trackOrder.right.length-1]].bounds.right + this.config.track.padding;
    } else {
      let side = this.sceneGraph.namedChildren['lhst'];
      side.removeChild(side.namedChildren[key],key);
      let idx = this.trackOrder.left.indexOf(key);
      this.trackOrder.left.splice(idx,1);
      this.trackOrder.left.forEach((track,idx) => {
        console.log(track);
        if(idx === 0){
          side.namedChildren[track].bounds.translate(-side.namedChildren[track].bounds.left ,0);
        } else {
          side.namedChildren[track].bounds.translate(side.namedChildren[this.trackOrder.left[idx-1]].canvasBounds.right - side.namedChildren[track].canvasBounds.left,0);
        }
      });
      if(this.trackOrder.left.length)
      side.bounds.width = side.namedChildren[this.trackOrder.left[this.trackOrder.left.length-1]].bounds.right + this.config.track.padding;
    }
    delete this.tracks[key];
   //redraw
    this.shiftMajorGroups();
    this.draw();
  }
}

