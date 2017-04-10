/**
  * CorrespondenceMap
  * Mithril component representing correspondence lines between 2 or more
  * BioMaps with an html5 canvas element.
  */
import m from 'mithril';

import {Bounds} from '../util/Bounds';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';


export class CorrespondenceMap extends SceneGraphNodeBase {

  /* define accessors for both bounds and domBounds; because this class is both
  /* a mithril component (has a view method()) and a scenegraph node (the root
  /* node for this canvas, we need to maintain both a domBounds and a bounds
  /* property. */
  get bounds() {
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
    this.dirty = ! this._domBounds || ! this._domBounds.areaEquals(newBounds);
    this._domBounds = newBounds;
    // only perform layouting when the domBounds has changed in area.
    if(this.dirty) {
      this._layout();
    }
  }

  set bioMaps(maps) {
    this._bioMaps = maps;
  }
  get bioMaps() { return this._bioMaps; }

  // override the children prop. getter
  get children() {
    return this.correspondenceMarks;
  }
  set children(ignore) {} // we create own children in _layout


  /* mithril lifecycle callbacks */

  oncreate(vnode) {
    // note here we are not capturing bounds from the dom, rather, using the
    // bounds set by the layout manager class (HorizontalLayout or
    // CircosLayout).
    this.canvas = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this._draw();
  }

  onupdate() {
    // note here we are not capturing bounds from the dom, rather, using the
    // bounds set by the layout manager class (HorizontalLayout or
    // CircosLayout).
    this._draw();
  }

  /* mithril component render callback */
  view() {
    let b = this.domBounds || {};
    return m('canvas', {
      class: 'cmap-canvas cmap-correspondence-map',
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;`,
      width: b.width,
      height: b.height
    });
  }

  _layout() {
//    console.log('CorrespondenceMap canvas layout');
    this.correspondenceMarks = [];
    // TODO: for each bioMap, create a CorrespondenceMark for each common feature
  }

  // draw canvas scenegraph nodes
  _draw() {
    let ctx = this.context2d;
    if(! ctx) return;
    if(! this.domBounds) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.children.map(child => child.draw(ctx));
    ctx.restore();
    // FIXME: have to prevent redraws of canvas when the canvas is only being
    // moved around the DOM, not being resized.
//    console.log('CorrespondenceMap canvas draw');
  }
}
