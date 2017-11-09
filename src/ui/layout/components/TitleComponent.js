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
    vnode.state.leftStart = vnode.state.bioMaps[vnode.state.order].domBounds.left;
    vnode.state.panEnd = false;
    vnode.state._gestureRegex = {
      pan: new RegExp('^pan')
    };
  },

  oncreate: function(vnode){
    vnode.dom.mithrilComponent = this;
    vnode.dom.mithrilComponent.handleGesture = vnode.tag.handleGesture;
    vnode.state._onPan = vnode.tag._onPan;
    vnode.state.bmap = vnode.state.bioMaps[vnode.state.domOrder];
    console.log("pre testGubbins", vnode.state.order, vnode.state.bmap.domBounds.left,this.bmap.domBounds.width,this.bmap.domBounds.right);
    vnode.state.lastPanEvent = null;
    vnode.state.zIndex = 0;
    this.vnode = vnode;
  },
  onbeforeupdate: function(vnode){
    if(this.titleOrder[this.order] != this.domOrder){
      if(this.titleOrder[this.order] > this.domOrder){
        console.log("swapTest Right",this.order,this.domOrder,this.leftBound, this.bioMaps[this.titleOrder.indexOf(this.domOrder+1)].domBounds.width);
        this.leftBound += this.bioMaps[this.titleOrder.indexOf(this.domOrder+1)].domBounds.width;
        this.rightBound += this.bioMaps[this.titleOrder.indexOf(this.domOrder+1)].domBounds.width;
      } else {
        this.leftBound -= this.bioMaps[this.titleOrder.indexOf(this.domOrder-1)].domBounds.width;
        this.rightBound -= this.bioMaps[this.titleOrder.indexOf(this.domOrder-1)].domBounds.width;
      }
      this.domOrder = this.titleOrder[this.order];
    }
  },
  onupdate: function(vnode){
    let dispOffset = vnode.state.bioMaps[vnode.state.order].domBounds.left - vnode.state.leftStart;
    if (vnode.state.left != dispOffset){
      this.left = dispOffset;
      this.dirty=true;
    }
    if(this.dirty){ // trigger redraw on changed canvas that has possibly edited bounds in process of view layout
      this.dirty=false;
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
      this.pan[0] = true;
      m.redraw();
      return;
    }
    
    let swapPosition = this.left + this.leftStart;
    const leftMap = this.titleOrder.indexOf(this.domOrder-1);
    const rightMap = this.titleOrder.indexOf(this.domOrder +1);
    let leftWidth = leftMap > -1 ? this.bioMaps[leftMap].domBounds.width : 0;
    let rightWidth = rightMap > -1 ? this.bioMaps[rightMap].domBounds.width : 0;
    console.log("pantest base",this.order,this.domOrder,leftMap,rightMap,this.left,this.leftBound,this.rightBound,swapPosition,this.titleOrder);
    let delta = {};
    if(this.lastPanEvent) {
      delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
    } else {
       delta.x = Math.round(evt.deltaX);
    }
    this.left += delta.x
      console.log("pantest other",this.domOrder, this.left, this.leftBound, this.rightBound);      
      let leftEdge = this.leftBound;
      if(this.domOrder > 0){
        leftEdge -= this.bioMaps[leftMap].domBounds.width;
      }

    if( this.domOrder < this.bioMaps.length-1 && swapPosition > this.leftBound+rightWidth){ // && this.left >= this.bioMaps[this.order].domBounds.width){
    
      console.log("pantest swapping pre R", this.domOrder, rightMap);
      this.titleOrder[this.order] ++;
      this.titleOrder[rightMap] --;
    
    } else if( this.domOrder > 0 && swapPosition < this.leftBound - leftWidth){
    
      this.titleOrder[this.order] --;
      this.titleOrder[leftMap] ++;
    
    } else if(!(this.domOrder === 0 && this.left < this.leftBound)&&!(this.domOrder === this.bioMaps.length-1 && this.left+this.leftStart > this.leftBound)){
//      console.log("panTest shift", this.domOrder, this.bioMaps.length, this.left+this.startLeft, this.leftBound);
      let movedMap = rightMap;
      if(this.left + delta.x < 0){
        movedMap = leftMap
      }; 
      let shiftScale = this.bioMaps[this.order].domBounds.width/this.bioMaps[movedMap].domBounds.width;
      console.log("panTest shift", this.domOrder, this.bioMaps.length,this.leftBound,shiftScale);
      this.bioMaps[this.order].domBounds.left += delta.x;
      this.bioMaps[this.order].domBounds.right += delta.x;
      const mw = this.bioMaps[movedMap].domBounds.width;
      this.bioMaps[movedMap].domBounds.left -= Math.round(delta.x*shiftScale);
      this.bioMaps[movedMap].domBounds.right = this.bioMaps[movedMap].domBounds.left + mw;
    } else {
      this.left -= delta.x;
    }

    this.lastPanEvent = evt;
    m.redraw();
    return true;
  }
}

