/**
 *
 * Base Component, placeholder for other canvas components
 *
 */

import m from 'mithril';
import {Bounds} from '../../../model/Bounds';

export class BioMapComponent {
  constructor(vnode) {
  }

  oncreate(vnode) {
    //have state be tied to passed attributes
    vnode.state = vnode.attrs;

    //dom components and state
    vnode.state.canvas = vnode.state.bioMap.canvas = vnode.dom;
    vnode.state.domBounds = vnode.state.bioMap.domBounds;
    vnode.state.context2d = vnode.state.bioMap.context2d = vnode.state.canvas.getContext('2d');
    vnode.state.context2d.imageSmoothingEnabled = false;

    //setup vnode.dom for ui gesture handling
    vnode.dom.mithrilComponent = this;

    //store vnode to be able to access state for non mithril lifecycle commands
    this.vnode = vnode;
  }

  onupdate(vnode) {
    //redraw biomap if dirty (drawing has changed, instead of just changing position)
    if (vnode.state.bioMap.dirty == true) {
      vnode.state.context2d.clearRect(0, 0, vnode.state.canvas.width, vnode.state.canvas.height);
      vnode.state.bioMap.draw();
    }
  }

  view(vnode) {
    // store these bounds, for checking in drawLazily()
    let domBounds = vnode.state.domBounds || null;
    if (domBounds && !domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = domBounds;
    }
    let b = domBounds || {};
    let selectedClass = vnode.state.selected ? 'selected' : '';
    return m('canvas', {
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: `left: ${b.left}px; top: ${b.top}px;
               width: ${b.width}px; height: ${b.height}px;
               transform: rotate(${vnode.state.rotation}deg);`,
      width: b.width,
      height: b.height
    });
  }

  handleGesture(evt) {
    let state = this.vnode.state;
    if (state.bioMap.handleGesture(evt)) {
      state.bioMap.dirty = true;
      return true;
    }
    return false;
  }
}

