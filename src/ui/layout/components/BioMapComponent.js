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
  }

  oncreate(vnode) {
    // Check if vnode.attrs is defined
    if (vnode.attrs) {
      //have state be tied to passed attributes
      vnode.state.attrs = vnode.attrs;
  
      //dom components and state
      vnode.state.canvas = vnode.state.attrs.bioMap.canvas = vnode.dom;
      vnode.state.domBounds = vnode.state.attrs.bioMap.domBounds;
      vnode.state.context2d = vnode.state.attrs.bioMap.context2d = vnode.state.canvas.getContext('2d');
      vnode.state.context2d.imageSmoothingEnabled = false;
  
      //setup vnode.dom for ui gesture handling
      vnode.dom.mithrilComponent = this;
  
      //store vnode to be able to access state for non mithril lifecycle commands
      this.vnode = vnode;
    } else {
      console.error('vnode.attrs is undefined');
    }
  }

  onupdate(vnode) {
    //redraw biomap if dirty (drawing has changed, instead of just changing position)
    if (vnode.state.attrs.bioMap && vnode.state.attrs.bioMap.dirty === true) {
      vnode.state.context2d.clearRect(0, 0, vnode.state.canvas.width, vnode.state.canvas.height);
      vnode.state.attrs.bioMap.draw();
    }
  }

  view(vnode) {
    // store these bounds, for checking in drawLazily()
    if(vnode.state.attrs.bioMap && vnode.state.attrs.bioMap.model !== vnode.attrs.bioMap.model){
      vnode.attrs.bioMap.canvas = vnode.state.attrs.bioMap.canvas;
      vnode.state.attrs.bioMap = vnode.attrs.bioMap;
      vnode.state.domBounds = vnode.state.attrs.bioMap.domBounds;
      vnode.state.context2d = vnode.state.attrs.bioMap.context2d = vnode.state.canvas.getContext('2d');
      vnode.state.context2d.imageSmoothingEnabled = false;
    }
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
    if (state.attrs.bioMap.handleGesture(evt)) {
      state.attrs.bioMap.dirty = true;
      return true;
    }
    return false;
  }
}
