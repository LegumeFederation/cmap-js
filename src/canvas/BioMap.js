/**
  * BioMap
  * Mithril component representing a Biological Map with a html5 canvas element.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {mix} from '../../mixwith.js/src/mixwith';

import {Bounds} from '../util/Bounds';
//import {FeatureMark} from './FeatureMark';
//import {MapBackbone} from './MapBackbone';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {DrawLazilyMixin} from './DrawLazilyMixin';
import {RegisterComponentMixin} from '../ui/layout/RegisterComponentMixin';
import {selectedMap} from '../topics';

export class BioMap
       extends mix(SceneGraphNodeBase)
       .with(DrawLazilyMixin, RegisterComponentMixin) {

  constructor({bioMapModel, appState, layoutBounds}) {
    super({});

    this.model = bioMapModel;
    this.appState = appState;

    // note: this.domBounds is where the canvas element is absolutely positioned
    // by mithril view()
    this.domBounds = new Bounds({
      left: layoutBounds.left,
      top: layoutBounds.top,
      width: Math.floor(100 + Math.random() * 500), // FIXME perform actual layout
      height: layoutBounds.height
    });

    // this.bounds (scenegraph) has the same width and height, but zero the
    // left/top because we are the root node in a canvas sceneGraphNode
    // heirarchy
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
  }

  // override the children prop. getter
  get children() {
    return [this.backbone].concat(
      this.featureMarkers,
      this.featureLabels
    );
  }
  set children(ignore) {}

  get selected() {
    return this.appState.selection.bioMaps.indexOf(this) !== -1;
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.drawLazily(this.domBounds);
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    console.assert(this.el === vnode.dom);
    let b = new Bounds(this.el.getBoundingClientRect());
    console.log('BioMap.onupdate', b.width, b.height, this.el);
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    if(this.domBounds && ! this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    let selectedClass = this.selected ? 'selected' : '';
    return m('canvas', {
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: rotate(${this.rotation}deg);`,
      width: b.width,
      height: b.height
    });
  }

  /**
   * custom gesture event dispatch listener; see LayoutContainer
   */
  handleGesture(evt) {
    if(evt.type.match(this._gestureRegex.tap)) {
      return this._onTap(evt);
    }
    return false; // dont stop evt propagation
  }

  _onTap(evt) {
    let sel = this.appState.selection.bioMaps;
    let i = sel.indexOf(this);
    if(i === -1) {
      sel.push(this);
    }
    else {
      sel.splice(i, 1);
    }
    m.redraw();
    PubSub.publish(selectedMap, {
      evt: evt,
      data: this.appState.selection.bioMaps
    });
    return true;
  }

  _onZoom(evt) {
    console.log('onZoom', evt);
    // // FIXME: get distance of touch event, apply to
    // let normalized = evt.deltaY / this.bounds.height;
    // this.state.tools.zoomFactor += normalized;
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
   * draw our scenegraph children our canvas element
   */
  draw() {
    let ctx = this.context2d;
    if(! ctx) return;
    console.log('BioMap canvas draw', this.domBounds.width, this.domBounds.height);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.children.map(child => child && child.draw(ctx));
    ctx.restore();
    // store these bounds, for checking in drawLazily()
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
