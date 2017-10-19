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
    console.log('title component oi', vnode.state.titleOrder);
    vnode.state.left = 0;
    vnode.state.originalLeft = vnode.state.bioMaps[vnode.state.order].domBounds.left;
    vnode.state.dirty = false;
    vnode.state.domOrder = vnode.state.titleOrder[vnode.state.order];
    vnode.state.leftBound = vnode.state.bioMaps[vnode.state.order].domBounds.left;
    vnode.state.rightBound = vnode.state.bioMaps[vnode.state.order].domBounds.right;
    vnode.state.pan = false;
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
    //if(vnode.state.contentBounds && !vnode.state.lastPanEvent){
    //  vnode.state.left = vnode.state.contentBounds.left;
    //}
    //if(vnode.state.domOrder !== vnode.state.titleOrder[vnode.state.order]){
    //  vnode.state.domOrder = vnode.state.titleOrder[vnode.state.order];
   // }
  },
  onupdate: function(vnode){
    let dispOffset = vnode.state.bioMaps[vnode.state.order].domBounds.left - vnode.state.leftBound;
//   console.log("onupdate title: o, do, l, lb, db, cb", this.order,this.domOrder, this.left, this.leftBound, vnode.state.bioMaps[vnode.state.order].domBounds.left,vnode.state.contentBounds.left,dispOffset);
   console.log("onupdate title: o, do, lb, rb", this.order,this.domOrder, this.leftBound, this.rightBound,dispOffset);
   //if (vnode.state.order !== vnode.state.titleOrder[vnode.state.order]){
   //  vnode.state.order = vnode.state.titleOrder[vnode.state.order];
   //}
   if (vnode.state.left != dispOffset){
      vnode.state.bioMaps[vnode.state.order].domBounds.left += vnode.state.left - dispOffset;
      vnode.state.bioMaps[vnode.state.order].domBounds.right += vnode.state.left - dispOffset;
      this.rightBound = this.leftBound + vnode.state.bioMaps[vnode.state.order].domBounds.width;
    //console.log("onupdate title offset post: o, do, lb, rb", this.order,this.domOrder, this.leftBound, this.rightBound,dispOffset);
      this.dirty=true;
    }
    if(this.dirty){
      this.dirty=false;
      m.redraw();
    }
  },
  view: function(vnode){
    if(!vnode.attrs || !vnode.state.contentBounds) return;
    console.log("view the view of a view that is viewy", vnode.state.bioMaps, vnode.state.domOrder);
    let bMap = vnode.state.bioMaps[vnode.state.order];
    console.log('title Component view',bMap);
    let left = vnode.state.left + vnode.state.contentBounds.left;
    console.log("I should be",vnode.state.domOrder);
    return  m('div', {
      class: 'swap-div', id: `swap-${vnode.state.domOrder}`,
      style: `display:grid; position:relative; left:${left}px; min-width:${bMap.domBounds.width}px; z-index:${vnode.state.zIndex};`},
      [m('div',{class:'map-title',style:'display:inline-block;'}, [bMap.model.name,m('br'),bMap.model.source.id])
      ]
    );
  },
  handleGesture: function(evt){
    console.log('title component hg',evt.type);
    if(evt.type.match(this._gestureRegex.pan)){
      return this._onPan(evt);
    }
    return true;
  },
  _onPan: function(evt){
    console.log("onupdate title: pan",this.order,this.domOrder, this.titleOrder);
    if(evt.type === 'panstart'){
      this.vnode.state.zIndex = 1000; 
      this.pan = true;
    }
    if(evt.type === 'panend') {
      this.vnode.zIndex =  0; 
      this.dirty = true;
      this.left = 0;
      const tmp = this.bioMaps[0]
      this.bioMaps[0] = this.bioMaps[1];
      this.bioMaps[1] = tmp;
      m.redraw();
      return;
    }
    let delta = {};
    if(this.lastPanEvent) {
      delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
    } else {
       delta.x = Math.round(evt.deltaX);
    }
    if( this.domOrder < this.bioMaps.length-1 && this.left >= this.rightBound){
      console.log ("exceeding bounds onupdate title", this.order,this.domOrder,this.titleOrder,this.rightBound);
      //swap map
      this.rightBound += this.bioMaps[this.order].domBounds.width;
      const tmp = this.bioMaps[this.domOrder]
      this.bioMaps[this.domOrder] = this.bioMaps[this.domOrder+1];
      this.bioMaps[this.domOrder+1] = tmp;
      //update titleOrders to allow redraw to catch swap
      console.log("title: pan pass", this.order, this.domOrder)
      this.titleOrder[this.order] ++;
      this.titleOrder[this.domOrder+1]--;
      this.domOrder = this.titleOrder[this.order];
      console.log("title: pan pass", this.order, this.domOrder)
      this.dirty = true;
    } else if( this.domOrder > 0 && this.bioMaps[this.domOrder].domBounds.right < this.leftBound){
      console.log ("exceeding bounds onupdate title l", this.order,this.domOrder,this.titleOrder,this.rightBound);
      //swap map
      this.rightBound -= this.bioMaps[this.order].domBounds.width;
      const tmp = this.bioMaps[this.domOrder]
      this.bioMaps[this.domOrder] = this.bioMaps[this.domOrder-1];
      this.bioMaps[this.domOrder-1] = tmp;
      //update titleOrders to allow redraw to catch swap
      console.log("title: pan pass", this.order, this.domOrder)
      this.titleOrder[this.order] --;
      this.titleOrder[this.domOrder-1]++;
      this.domOrder = this.titleOrder[this.order];
      console.log("title: pan pass", this.order, this.domOrder)
      this.dirty = true;
    }
      this.left += delta.x;
      this.bioMaps[this.order].domBounds.left += delta.x;

      this.bioMaps[this.order].domBounds.right += delta.x;

    this.lastPanEvent = evt;
    m.redraw();
    return true;
  }
}

