/**
 *
 * Base Component, placeholder for other canvas components
 *
 */

import m from 'mithril';

import {mix} from '../../../../mixwith.js/src/mixwith';
import {DrawLazilyMixin} from '../../../canvas/DrawLazilyMixin';
import {Bounds} from '../../../model/Bounds';

export let TitleComponent = {
  oninit: function(vnode){
    vnode.state = vnode.attrs;
    vnode.state.left = 0;
    vnode.state.dirty = false;
    vnode.state.domOrder = vnode.state.titleOrder[vnode.state.order];
    vnode.state.leftBound = vnode.state.bioMaps[vnode.state.order].domBounds.left;
    vnode.state.rightBound = vnode.state.bioMaps[vnode.state.order].domBounds.right;
    vnode.state.panEnd = false;
    vnode.state.pan = vnode.state.bioMaps[vnode.state.order].pan = false;
    vnode.state._gestureRegex = {
      pan: new RegExp('^pan')
    };
  },

  oncreate: function(vnode){
    vnode.dom.mithrilComponent = this;
    vnode.dom.mithrilComponent.handleGesture = vnode.tag.handleGesture;
    vnode.state._onPan = vnode.tag._onPan;
    vnode.state.bmap = vnode.state.bioMaps[vnode.state.domOrder];
    vnode.state.lastPanEvent = null;
    vnode.state.zIndex = 0;
    this.vnode = vnode;
  },
  onbeforeupdate: function(vnode){
  },
  onupdate: function(vnode){
    let dispOffset = vnode.state.bioMaps[vnode.state.order].domBounds.left - vnode.state.leftBound;
    if (vnode.state.left != dispOffset){
      console.log("title: pan dispOffset test", this.order, this.titleOrder[this.order],vnode.state.bioMaps[vnode.state.order].domBounds.left,vnode.state.leftBound);
      if(this.panEnd){ // snap maps to bounds after pan event has moved
        const shift = vnode.state.left - dispOffset;
        vnode.state.bioMaps[vnode.state.domOrder].domBounds.left += shift;
        vnode.state.bioMaps[vnode.state.domOrder].domBounds.right += shift;
        if( this.order < this.bioMaps.length-1){
          const width = this.bioMaps[this.domOrder + 1].domBounds.width;
          this.bioMaps[this.domOrder + 1].domBounds.left = this.bioMaps[this.domOrder].domBounds.right;
          this.bioMaps[this.domOrder + 1].domBounds.right = this.bioMaps[this.domOrder].domBounds.right+width;
        }
        if( this.order > 0){
          const width = this.bioMaps[this.domOrder - 1].domBounds.width;
          this.bioMaps[this.domOrder - 1].domBounds.right = this.bioMaps[this.domOrder].domBounds.left;
          this.bioMaps[this.domOrder - 1].domBounds.left = this.bioMaps[this.domOrder].domBounds.left - width;
        }
      } else { // shift title after map moves
        this.left = dispOffset;
      }
      m.redraw();

      this.dirty=true;
    }
    if(this.dirty){ // trigger redraw on changed canvas that has possibly edited bounds in process of view layout
      this.dirty=false;
      m.redraw();
    }
    if(this.panEnd){
      this.panEnd = false;
      m.redraw();
    }
  },
  view: function(vnode){
    if(!vnode.attrs || !vnode.state.contentBounds) return;
    let bMap = vnode.state.bioMaps[vnode.state.order];
    vnode.state.contentBounds.left = vnode.state.contentBounds.right - vnode.state.contentBounds.width;
    let left =  vnode.state.left + vnode.state.contentBounds.left;
    return  m('div', {
      class: 'swap-div', id: `swap-${vnode.state.domOrder}`,
      style: `display:grid; position:relative; left:${left}px; min-width:${bMap.domBounds.width}px; z-index:${vnode.state.zIndex};`},
      [m('div',{class:'map-title',style:'display:inline-block;'}, [bMap.model.name,m('br'),bMap.model.source.id])
      ]
    );
  },
  handleGesture: function(evt){
    if(evt.type.match(this._gestureRegex.pan)){
      return this._onPan(evt);
    }
    return true;
  },
  _onPan: function(evt){
    console.log("panTest",this.order, this.leftBound, this.rightBound, this.bioMaps[this.order].domBounds.left, this.bioMaps[this.order].domBounds.right, this.left);
    if(evt.type === 'panstart'){
      this.vnode.state.zIndex = 1000; 
      this.left = 0;
    }
    if(evt.type === 'panend') {
      this.vnode.zIndex =  0; 
      this.dirty = true;
      this.left = 0;
      this.lastPanEvent = null;
      this.panEnd = true;
      m.redraw();
      return;
    }
    const leftMap = this.order-1;
    const rightMap = this.order+1;

    let delta = {};
    if(this.lastPanEvent) {
      delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
    } else {
       delta.x = Math.round(evt.deltaX);
    }
    if( this.domOrder < this.bioMaps.length-1 && this.left >= this.bioMaps[this.order].domBounds.width && this.lastPanEvent){
      console.log("swapping pre R", this.domOrder, rightMap,this.titleOrder);
      this.titleOrder[this.order] ++;
      this.titleOrder[rightMap] --;
      const tmp = this.bioMaps[this.order];
      this.bioMaps[this.order] = this.bioMaps[rightMap];
      this.bioMaps[rightMap] = tmp;
      console.log("swapping divs R", this.titleOrder);
      this.left = 0;
      this.lastPanEvent = null;
      this.dirty = true;
    } else if( this.domOrder > 0 && (-1*this.left) >= this.bioMaps[this.order].domBounds.width && this.lastPanEvent){
      console.log("swapping pre L", this.domOrder, leftMap);
      this.titleOrder[this.order] --;
      this.titleOrder[leftMap] ++;
      const tmp = this.bioMaps[this.order];
      this.bioMaps[this.domOrder] = this.bioMaps[leftMap];
      this.bioMaps[leftMap] = tmp;
      console.log("swapping divs L", this.titleOrder);
      this.left = 0;
      this.lastPanEvent = null;
      this.dirty = true;
    } else {
      let movedMap = rightMap;
      if(this.left + delta.x < 0){
        movedMap = leftMap
      }; 
      this.left += delta.x;
      if( (this.left > 0 && this.order < this.bioMaps.length-1) || (this.left < 0 && this.order > 0)){
        this.bioMaps[this.domOrder].domBounds.left += delta.x;
        this.bioMaps[this.domOrder].domBounds.right += delta.x;
        this.bioMaps[movedMap].domBounds.left -= delta.x;
        this.bioMaps[movedMap].domBounds.right -= delta.x;
      } else {
        this.left -= delta.x;
      }
    }

    this.lastPanEvent = evt;
    m.redraw();
    return true;
  }
}

