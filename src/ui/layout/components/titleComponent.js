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
    console.log('title component oi', vnode,this);
    vnode.state = vnode.attrs;
    vnode.state.left = 0;
    vnode.state._gestureRegex = {
      pan: new RegExp('^pan')
    };
  },

  oncreate: function(vnode){
    console.log('title component oc', vnode,this);
    vnode.dom.mithrilComponent = this;
    vnode.dom.mithrilComponent.handleGesture = vnode.tag.handleGesture;
    vnode.state._onPan = vnode.tag._onPan;
    vnode.state.bmap = vnode.state.bioMaps[vnode.state.order];
    vnode.state.lastPanEvent = null;
  },
  onbeforeupdate: function(vnode){
    console.log('title component obu',vnode.state);
    if(vnode.state.contentBounds && !vnode.state.lastPanEvent){
      vnode.state.left = vnode.state.contentBounds.left;
    }
  },
  view: function(vnode){
    if(!vnode.attrs || !vnode.state.contentBounds) return;
    let bMap = vnode.state.bioMaps[vnode.state.order];
    console.log('title Component view',bMap);
    let left = vnode.state.left-1;
    bMap.lb.left +=vnode.state.left;
    return  m('div', {
      class: 'swap-div', id: `swap-${vnode.state.order}`,
      style: `display:grid; position:relative; left:${left}px; min-width:${bMap.domBounds.width}px;`},
      [m('div',{class:'map-title',style:'display:inline-block;'}, [bMap.model.name,m('br'),bMap.model.source.id])
      ]
    );
  },
  handleGesture: function(evt){
    console.log('title component hg',evt,this);
    if(evt.type.match(this._gestureRegex.pan)){
      return this._onPan(evt);
    }
    return true;
  },
  _onPan: function(evt){
    console.log('title component hg pan');
    if(evt.type === 'panend') {
      this.lastPanEvent = null;
      return;
    }
    let delta = {};
    if(this.lastPanEvent) {
      delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
      delta.y = -1 * (this.lastPanEvent.deltaY - evt.deltaY);
    } else {
       delta.x = evt.deltaX;
       delta.y = evt.deltaY;
    }
    this.left += delta.x;
    this.lastPanEvent = evt;
    m.redraw();
    return true;
  }
}

