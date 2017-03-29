/**
 * Mithril component for rendering a Biological Map with a canvas element.
 */
import m from 'mithril';
import {Bounds} from '../util/Bounds';
import {FeatureMarker} from './FeatureMarker';
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
      let feature = new FeatureMarker({
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
    return [].concat(
      [this.backbone],
      this.featureMarkers,
      this.featureLabels
    );
  }
  set children(ignore) {} // we create own children in oninit

  get bounds() {
    return new Bounds({
      top: 0, left: 0,
      width: this.domBounds.width, height: this.domBounds.height
    });
  }
  set bounds(ignore) {} // we are the root of canvas scenegraph

  // *note* domBounds accessors are for the dom bounds of the canvas element.
  get domBounds() {
    return this._domBounds;
  }

  set domBounds(b) {
    this._domBounds = b;
    this._layout();
  }

  /* mithril lifecycle callbacks */
  oncreate(vnode) {
    // note here we are not capturing bounds from the dom, rather, using the
    // bounds set by the layout manager class (HorizontalLayout or
    // CircosLayout).
    this.canvas = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    if(this.domBounds) {
      this._layout();
      this._draw();
    }
  }

  onupdate(vnode) {
    // note here we are not capturing bounds from the dom, rather, using the
    // bounds set by the layout manager class (HorizontalLayout or
    // CircosLayout).

    // FIXME: this redraws the canvas even when the canvas width/height
    // was not changed; only redraw entire canvas if it needs to.

    this._layout();
    this._draw();
  }

  /* mithril component render callback */
  view() {
    let b = this.domBounds || {};
    return m('canvas', {
      class: 'cmap-canvas cmap-biomap',
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: rotate(${this.rotation}deg)`,
      width: b.width,
      height: b.height
    });
  }

  /* private methods */

  // draw canvas scenegraph nodes
  _draw() {
    if(! this.context2d) return;
    console.log('BioMap canvas draw');
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.children.map(child => child.draw(this.context2d));
  }

  _layout() {
    let backboneWidth = this.domBounds.width * 0.25;
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
    // TODO: layout featureLabels
  }

}
