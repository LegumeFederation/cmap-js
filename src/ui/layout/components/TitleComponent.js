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
    vnode.state.data = vnode.attrs;
    vnode.state.data.left = 0;
    vnode.state.data.domOrder = vnode.state.data.titleOrder.indexOf(vnode.state.data.order);
    vnode.state.data.leftBound = vnode.state.data.bioMaps[vnode.state.data.order].domBounds.left;
    vnode.state.data.rightBound = vnode.state.data.bioMaps[vnode.state.data.order].domBounds.right;
    vnode.state.data.leftStart = vnode.state.data.bioMaps[vnode.state.data.order].domBounds.left;
    vnode.state.data._gestureRegex = {
      pan: new RegExp('^pan')
    };
  },

  oncreate: function (vnode) {
    // register mithrilComponent for gesture handling
    vnode.dom.mithrilComponent = this;
    // register functions to state/dom for gesture handling
    vnode.dom.mithrilComponent.handleGesture = vnode.tag.handleGesture;
    vnode.state.data._onPan = vnode.tag._onPan;
    vnode.state.data.zIndex = 0;
    this.vnode = vnode;
    // set up initial state
    this.titleOrder = vnode.state.data.titleOrder;
    this.order = vnode.state.data.order;
    this.domOrder = vnode.state.data.domOrder;
    this.left = vnode.state.data.left;
    this.leftBound = vnode.state.data.leftBound;
    this.rightBound = vnode.state.data.rightBound;
    this.leftStart = vnode.state.data.leftStart;
    this.bioMaps = vnode.state.data.bioMaps;
    this.dirty = false;
    this._gestureRegex = vnode.state.data._gestureRegex;
  },

  onbeforeupdate: function (vnode) {
    vnode.state.data.bioMaps = vnode.attrs.bioMaps;
    vnode.state.data.domOrder = vnode.state.data.titleOrder.indexOf(vnode.state.data.order);
    if (this.titleOrder[this.domOrder] !== this.order) {
      this.domOrder = this.titleOrder.indexOf(this.order);
    }
  },

  onupdate: function (vnode) {
    let dispOffset = vnode.state.data.bioMaps[vnode.state.data.order].domBounds.left - vnode.state.data.leftStart;
    if (vnode.state.data.left !== dispOffset && !vnode.state.data.swap) {
      this.left = dispOffset;
      this.dirty = true;
    }
    if (vnode.state.data.swap) {
      this.swap = false;
      this.dirty = true;
      this.left = 0;
    }
    if (this.dirty) { // trigger redraw on changed canvas that has possibly edited bounds in process of view layout
      this.dirty = false;
      m.redraw();
    }
  },

  view: function (vnode) {
    if (!vnode.attrs || !vnode.state.data.contentBounds) return;
    let bMap = vnode.state.data.bioMaps[vnode.state.data.order];
    vnode.state.data.contentBounds.left = vnode.state.data.contentBounds.right - vnode.state.data.contentBounds.width;
    let left = vnode.state.data.left + vnode.state.data.contentBounds.left;
    return m('div', {
        class: 'swap-div', id: `swap-${vnode.state.data.domOrder}`,
        style: `display:grid; position:relative; left:${left}px; min-width:${bMap.domBounds.width}px; z-index:${vnode.state.data.zIndex};`
      },
      [m('div', {class: 'map-title', style: 'display:inline-block;'}, [bMap.model.name, m('br'), bMap.model.source.id])
      ]
    );
  },

  handleGesture: function (evt) {
    if (evt.type.match(this._gestureRegex.pan)) {
      return this._onPan(evt);
    }
    return true;
  },

  _onPan: function (evt) {
    //Start pan move zIndex up to prevent interrupting pan early
    if (evt.type === 'panstart') {
      this.vnode.state.data.zIndex = 1000;
      this.lastPanEvent = null;
      this.left = 0;
    }
    //End pan to set rearrangement
    if (evt.type === 'panend') {
      this.vnode.state.data.zIndex = 0;
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

