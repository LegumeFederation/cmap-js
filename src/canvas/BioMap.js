/**
  * BioMap
  * Mithril component representing a Biological Map with a html5 canvas element.
  */
import m from 'mithril';
import {mix} from '../../mixwith.js/src/mixwith';

import {Bounds} from '../util/Bounds';
import {FeatureMark} from './FeatureMark';
import {MapBackbone} from './MapBackbone';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {DrawLazilyMixin} from './DrawLazilyMixin';

export class BioMap extends mix(SceneGraphNodeBase).with(DrawLazilyMixin) {

  constructor({bioMapModel, layoutBounds}) {
    super({});

    console.log('BioMap()');
    // TODO: initialization and layout of canvas scengraphnode components
    // then the width will be known

    // this.domBounds is where the canvas element is absolutely positioned by
    // mithril view()
    this.domBounds = new Bounds({
      left: layoutBounds.left,
      top: layoutBounds.top,
      width: Math.floor(layoutBounds.height * 0.975), // FIXME actual layout
      height: layoutBounds.height
    });

    // this.bounds is the same width and height, but no left, top because we
    // are the root node in this sceneGraphNode heirarchy
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
  }

  // override the children prop. getter
  get children() {
    return [this.backbone].concat(
      this.featureMarkers,
      this.featureLabels
    );
  }
  set children(ignore) {}

  /* mithril lifecycle callbacks */
  oninit(vnode) {
    console.log('BioMap.oninit', this.domBounds.width, this.domBounds.height);
    this.model = vnode.attrs.model;
    this.appState = vnode.attrs.appState;
  }

  oncreate(vnode) {
    this.el = vnode.dom;

    let b = new Bounds(this.el.getBoundingClientRect());
    console.log('BioMap.oncreate', b.width, b.height, this.el);
    // note: here we are not capturing bounds from the dom, rather, using the
    // bounds set by the layout manager class (HorizontalLayout or
    // CircosLayout).
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.drawLazily(this.domBounds);
  }

  onupdate(vnode) {
    let b = new Bounds(this.el.getBoundingClientRect());
    console.log('BioMap.onupdate', b.width, b.height, this.el);
  }

  onremove() {
  }

  /* mithril component render callback */
  view() {
    // store these bounds, for checking in drawLazily()
    if(this.domBounds && ! this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    //console.log('BioMap mithril render', b.width, b.height);
    return m('canvas', {
      class: 'cmap-canvas cmap-biomap',
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: rotate(${this.rotation}deg);`,
      width: b.width,
      height: b.height
    });
  }

  /* dom event handlers */

  _onTap(evt) {
    console.log('onTap', evt, evt.target === this.canvas);
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
   * draw canvas scenegraph nodes
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
