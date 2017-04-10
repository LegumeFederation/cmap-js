/**
  * BioMap
  * Mithril component representing a Biological Map with a html5 canvas element.
  */
import m from 'mithril';
import Hammer from 'hammerjs';

import {Bounds} from '../util/Bounds';
import {FeatureMark} from './FeatureMark';
import {MapBackbone} from './MapBackbone';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class BioMap extends SceneGraphNodeBase {

  constructor(params) {
    super(params);
    // create a backbone node
    this.backbone = new MapBackbone({
      parent: this
    });
    // create featuremarker nodes
    this.featureMarkers = [];
    for (var i = 0; i < 100; i++) {
      let x = Math.floor(Math.random() * 1000);
      let featureName = '';
      for (var j = 0; j < 2; j++) {
        featureName += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
      let feature = new FeatureMark({
        parent: this,
        coordinates: {
          start: x,
          end: x, // FIXME: support ranges
        },
        rangeOfCoordinates: { start: 0, end: 1000},
        featureName: featureName,
        aliases: []
      });
      this.featureMarkers.push(feature);
    }
    // TODO: create feature labels
    this.featureLabels = [];
  }

  // override the children prop. getter
  get children() {
    return [this.backbone].concat(
      this.featureMarkers,
      this.featureLabels
    );
  }
  set children(ignore) {}

  /* define accessors for both bounds and domBounds; because this class is both
  /* a mithril component (has a view method()) and a scenegraph node (the root
  /* node for this canvas, we need to maintain both a domBounds and a bounds
  /* property. */
  get bounds() {
    if(! this.domBounds) return new Bounds({top:0, left: 0, width:0, height:0});
    return new Bounds({
      top: 0, left: 0,
      width: this.domBounds.width, height: this.domBounds.height
    });
  }
  set bounds(ignore) {} // we are the root of canvas scenegraph

  get domBounds() {
    return this._domBounds;
  }

  set domBounds(newBounds) {
    let dirty = ! Bounds.areaEquals(this._domBounds, newBounds);
    this._domBounds = newBounds;
    // only perform layouting when the domBounds has changed in area.
    if(dirty) {
      this._layout();
    }
  }

  /* mithril lifecycle callbacks */

  oncreate(vnode) {
    console.log(vnode);
    // note: here we are not capturing bounds from the dom, rather, using the
    // bounds set by the layout manager class (HorizontalLayout or
    // CircosLayout).
    this.canvas = vnode.dom;
    this.context2d = this.canvas.getContext('2d');

    this._setupEventHandlers();
    this._drawLazily(this.bounds);
  }

  onupdate() {
    this._drawLazily(this.bounds);
  }

  onremove() {
  }

  /* mithril component render callback */
  view() {
    // store these bounds, for checking in _drawLazily()
    if(this.domBounds && ! this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    console.log('BioMap mithril render', b.width, b.height);
    return m('canvas', {
      class: 'cmap-canvas cmap-biomap',
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: rotate(${this.rotation}deg)`,
      width: b.width,
      height: b.height
    });
  }

  /* dom event handlers */
  _setupEventHandlers() {
    // hammers for normalized mouse and touch gestures: zoom, pan, click
    let h = Hammer(this.canvas.parentElement);
    h.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    h.get('pinch').set({ enable: true });
    h.on('panmove panend', (evt) => this._onPan(evt));
    h.on('pinchmove pinchend', (evt) => this._onZoom(evt));
    h.on('tap', (evt) => this._onTap(evt));
  }

  _onTap(evt) {
    console.log('onTap', evt, evt.target === this.canvas);
  }

  _onZoom(evt) {
    console.log('onZoom', evt);
    // // FIXME: get distance of touch event
    // let normalized = evt.deltaY / this.bounds.height;
    // toolState.zoomFactor += normalized;
    // m.redraw();
  }

  _onPan(evt) {
    console.log('BioMap -> onPan', evt);
    // hammer provides the delta x,y in a distance since the start of the gesture
    // // so need to convert it to delta x,y for this event.
    // if(evt.type === 'panend') {
    //   this.lastPanEvent = null;
    //   return;
    // }
    // let delta = {};
    // if(this.lastPanEvent) {
    //   delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
    //   delta.y = -1 * (this.lastPanEvent.deltaY - evt.deltaY);
    // }
    // else {
    //   delta.x = evt.deltaX;
    //   delta.y = evt.deltaY;
    // }
    // m.redraw();
    this.lastPanEvent = evt;
  }

  /**
   * lazily draw on the canvas, because mithril updates the dom asynchronously.
   * The canvas will be cleared when mithril writes the new width and height
   * of canvas element into dom. So we cannot draw upon canvas until after that.
   */
  _drawLazily(wantedBounds) {
    if(wantedBounds.area === 0) return;
    if(this._drawLazilyTimeoutId) clearTimeout(this._drawLazilyTimeoutId);
    if(! Bounds.areaEquals(this.lastDrawnMithrilBounds, wantedBounds)) {
      console.log('waiting for wantedBounds from mithril: ', wantedBounds.width, wantedBounds.height);
      let tid1 = this._drawLazilyTimeoutId = setTimeout(() => {
        if(tid1 !== this._drawLazilyTimeoutId) return;
        this._drawLazily(wantedBounds);
      });
    }
    else {
      console.log('scheduling lazy draw for: ', wantedBounds.width, wantedBounds.height);
      let tid2 = this._drawLazilyTimeoutId = setTimeout(() => {
        if(tid2 !== this._drawLazilyTimeoutId) return;
        if(! Bounds.areaEquals(this.lastDrawnCanvasBounds, wantedBounds)) {
          this._draw();
        }
      });
    }
  }

  /**
   * draw canvas scenegraph nodes
   */
  _draw() {
    let ctx = this.context2d;
    if(! ctx) return;
    console.log('BioMap canvas draw', this.domBounds.width, this.domBounds.height);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.children.map(child => child.draw(ctx));
    ctx.restore();
    // store these bounds, for checking in _drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
  }

  /* private methods */

  _layout() {
    console.log('BioMap canvas layout', this.bounds.width, this.bounds.height);
    let backboneWidth = this.bounds.width * 0.25;
    this.backbone.bounds = new Bounds({
      top: this.domBounds.height * 0.025,
      left: this.domBounds.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: this.domBounds.height * 0.95
    });
    // set the feature markers on top of the backbone
    this.featureMarkers.forEach( marker => {
      let coordinatesToPixels = this.backbone.bounds.height / marker.rangeOfCoordinates.end;
      let y = marker.coordinates.start * coordinatesToPixels;
      marker.bounds = new Bounds({
        top: this.backbone.bounds.top + y,
        left: this.backbone.bounds.left,
        width: this.backbone.bounds.width,
        height: 1
      });
    });
  }
}
