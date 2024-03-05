/**
 *
 * Base Component, placeholder for other canvas components
 *
 */

import m from 'mithril';
import PubSub from 'pubsub-js';

import {mapReorder} from '../../../topics';

export let TitleComponent = {
  oninit: function (vnode) {
    vnode.state.attrs = vnode.attrs;
    vnode.state.left = 0;
    vnode.state.domOrder = vnode.state.attrs.titleOrder.indexOf(vnode.state.attrs.order);
    vnode.state.leftBound = vnode.state.attrs.bioMaps[vnode.state.attrs.order].domBounds.left;
    vnode.state.rightBound = vnode.state.attrs.bioMaps[vnode.state.attrs.order].domBounds.right;
    vnode.state.leftStart = vnode.state.attrs.bioMaps[vnode.state.attrs.order].domBounds.left;
    vnode.state._gestureRegex = {
      pan: new RegExp('^pan')
    };
  },
  oncreate: function (vnode) {
    // register mithrilComponent for gesture handling
    vnode.dom.mithrilComponent = this;
    // register functions to state/dom for gesture handling
    vnode.dom.mithrilComponent.handleGesture = vnode.tag.handleGesture;
    vnode.state._onPan = vnode.tag._onPan;
    vnode.state.zIndex = 0;
    this.vnode = vnode;
  },

  onbeforeupdate: function (vnode) {
    vnode.state.bioMaps = vnode.attrs.bioMaps;
    vnode.state.domOrder = vnode.state.attrs.titleOrder.indexOf(vnode.state.attrs.order);
    if (vnode.state.attrs.titleOrder[vnode.state.domOrder] !== vnode.state.attrs.order) {
      vnode.state.domOrder = vnode.state.attrs.titleOrder.indexOf(vnode.state.attrs.order);
    }
  },

  onupdate: function (vnode) {
    let dispOffset = vnode.state.attrs.bioMaps[vnode.state.attrs.order].domBounds.left - vnode.state.leftStart;
    if (vnode.state.left !== dispOffset && !vnode.state.swap) {
      vnode.state.left = dispOffset;
      vnode.state.dirty = true;
    }
    if (vnode.state.swap) {
      vnode.state.left = 0;
      vnode.state.swap = false;
      vnode.state.dirty = true;
      vnode.state.left = 0;
    }
    if (vnode.state.dirty) { // trigger redraw on changed canvas that has possibly edited bounds in process of view layout
      vnode.state.dirty = false;
      m.redraw();
    }
  },

  view: function (vnode) {
    if (!vnode.state.attrs || !vnode.state.attrs.contentBounds) return;
    let bMap = vnode.state.attrs.bioMaps[vnode.state.attrs.order];
    vnode.state.attrs.contentBounds.left = vnode.state.attrs.contentBounds.right - vnode.state.attrs.contentBounds.width;
    let left = vnode.state.left + vnode.state.attrs.contentBounds.left;
    return m('div', {
        class: 'swap-div', id: `swap-${vnode.state.domOrder}`,
        style: `display:grid; position:relative; left:${left}px; min-width:${bMap.domBounds.width}px; z-index:${vnode.state.zIndex};`
      },
      [m('div', {class: 'map-title', style: 'display:inline-block;'}, [bMap.model.name, m('br'), bMap.model.source.id])
      ]
    );
  },

  handleGesture: function (evt) {
    if (evt.type.match(this.vnode.state._gestureRegex.pan)) {
      return this.vnode.state._onPan(evt);
    }
    return true;
  },

  _onPan: function (evt) {
    //Start pan move zIndex up to prevent interrupting pan early
    if (evt.type === 'panstart') {
      this.vnode.state.zIndex = 1000;
      this.lastPanEvent = null;
      this.vnode.state.left = 0;
    }
    //End pan to set rearrangement
    if (evt.type === 'panend') {
      this.vnode.state.zIndex = 0;
      PubSub.publish(mapReorder, null);
      return;
    }

    //Pan the title
    //Calculate map movement
    let delta = {};
    if (this.lastPanEvent) {
      delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
    } else {
      delta.x = Math.round(evt.deltaX);
    }
    this.left += delta.x;

    //Setup maps and swap points
    let selLeftEdge = this.left + this.leftStart;
    //let selRightEdge = selLeftEdge + this.bioMaps[this.order].domBounds.width;
    const leftMap = this.domOrder > 0 ? this.titleOrder[this.domOrder - 1] : null;
    const rightMap = this.titleOrder[this.domOrder + 1] > -1 ? this.titleOrder[this.domOrder + 1] : null;
    const leftSwapBound = leftMap !== null ? this.leftBound - this.bioMaps[leftMap].domBounds.width : null;
    const rightSwapBound = rightMap !== null ? this.leftBound + this.bioMaps[rightMap].domBounds.width : null;
    if ((leftMap !== null) && selLeftEdge < leftSwapBound) { // Swap Left
      this.leftBound -= this.bioMaps[leftMap].domBounds.width;
      this.rightBound -= this.bioMaps[leftMap].domBounds.width;

      this.titleOrder[this.domOrder] = this.titleOrder[this.domOrder - 1];//= this.titleOrder[rightMap];
      this.titleOrder[this.domOrder - 1] = this.order;
      this.domOrder = this.titleOrder[this.domOrder];

    } else if ((rightMap !== null) && selLeftEdge > rightSwapBound) { // Swap Right
      this.leftBound += this.bioMaps[rightMap].domBounds.width;
      this.rightBound += this.bioMaps[rightMap].domBounds.width;

      this.titleOrder[this.domOrder] = this.titleOrder[this.domOrder + 1];//= this.titleOrder[rightMap];
      this.titleOrder[this.domOrder + 1] = this.order;
      this.domOrder = this.titleOrder[this.domOrder];

    } else if (!(!leftMap && selLeftEdge <= 0) && !(!rightMap && selLeftEdge >= this.leftBound)) { //Move current map and its left/right partner

      let movedMap = rightMap;

      if (selLeftEdge < this.leftBound || (selLeftEdge === this.leftBound && delta.x < 0)) {
        movedMap = leftMap;
      }

      let shiftScale = this.bioMaps[this.order].domBounds.width / this.bioMaps[movedMap].domBounds.width;
      this.bioMaps[this.order].domBounds.translate(delta.x,0);
      //this.bioMaps[this.order].domBounds.left += delta.x;
      //this.bioMaps[this.order].domBounds.right += delta.x;
      const mw = this.bioMaps[movedMap].domBounds.width;
      this.bioMaps[movedMap].domBounds.translate(-delta.x*shiftScale,0);
//      this.bioMaps[movedMap].domBounds.left -= delta.x * shiftScale;
//      this.bioMaps[movedMap].domBounds.right = this.bioMaps[movedMap].domBounds.left + mw;

    } else { // edge case don't move map
      this.left -= delta.x;
    }

    this.lastPanEvent = evt;
    m.redraw();
    return true;
  }
};

