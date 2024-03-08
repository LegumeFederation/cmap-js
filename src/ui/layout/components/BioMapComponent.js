/**
 *
 * Base Component, placeholder for other canvas components
 *
 */

import m from 'mithril';
//import {Bounds} from '../../../model/Bounds';

export class BioMapComponent {
  constructor(vnode) {
    console.log(vnode);
    this.attrs = vnode.attrs;
  }

  oncreate(vnode) {
    //have state be tied to passed attributes
    this.canvas = this.attrs.bioMap.canvas = vnode.dom;
    this.domBounds = this.attrs.bioMap.domBounds;
    this.context2d = this.attrs.bioMap.context2d = this.canvas.getContext('2d');
    this.context2d.imageSmoothingEnabled = false;

    //setup vnode.dom for ui gesture handling
    vnode.dom.mithrilComponent = this;

    //store vnode to be able to access state for non mithril lifecycle commands
    this.vnode = vnode;
  }

  onupdate() {
    //redraw biomap if dirty (drawing has changed, instead of just changing position)
    if (this.attrs.bioMap && this.attrs.bioMap.dirty === true) {
      this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.attrs.bioMap.draw();
    }
  }

  view(vnode) {
    // store these bounds, for checking in drawLazily()
    if(this.attrs.bioMap && this.attrs.bioMap.model !== vnode.attrs.bioMap.model){
      vnode.attrs.bioMap.canvas = this.attrs.bioMap.canvas;
      this.attrs.bioMap = vnode.attrs.bioMap;
      this.domBounds = this.attrs.bioMap.domBounds;
      this.context2d = this.attrs.bioMap.context2d = this.canvas.getContext('2d');
      this.context2d.imageSmoothingEnabled = false;
    }
    let domBounds = this.domBounds || null;
    if (domBounds && !domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = domBounds;
    }
    let b = domBounds || {};
    let selectedClass = this.attrs.selected ? 'selected' : '';
    return m('canvas', {
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: `left: ${b.left}px; top: ${b.top}px;
               width: ${b.width}px; height: ${b.height}px;
               transform: rotate(${this.attrs.rotation}deg);`,
      width: b.width,
      height: b.height
    });
  }

  handleGesture(evt) {
    if (this.attrs.bioMap.handleGesture(evt)) {
      this.attrs.bioMap.dirty = true;
      return true;
    }
    return false;
  }
}