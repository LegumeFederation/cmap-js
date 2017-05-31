/**
  * popover
  * A mithril component for displaying feature information.
  */
import m from 'mithril';

import {mix} from '../../../mixwith.js/src/mixwith';
import {Menu} from './Menus';
import {RegisterComponentMixin} from '../RegisterComponentMixin';

export class Popover extends mix(Menu).with(RegisterComponentMixin){

   constructor(){
    super();
    this.data = [];
   }

  oninit(vnode){
    super.oninit(vnode);
  }
   
  /**
   * mithril component render method
   */
  view(vnode) {
    let b = vnode.state.domBounds || {};
		let info = vnode.state.info || {data:[]};
    console.log(vnode);
    
		return m('div', {
       class: `biomap-info`,
       style: `left: ${info.left+b.left}px; top: ${info.top+b.top}px;
               width: 10em; height: 5em; border:1px solid #bbb;
               background: white; visibility: ${info.visible};
               position: absolute; display: inline-block; overflow-y:auto;
               z-index:10000; border-radius:4px;`,
       width: 10,
       height: 10,
     },this._generateInner(info.data));
  }

  _generateInner(data){
    console.log('data to generate',data);
    if(!data) return;
    console.log('data to generate',data);
    let bob = data.map(item => {
      return m('li',item.model.name);
    });
    return m('ul',{},bob);
  }


	handleGesture(){
		// prevent interacting with div from propegating events
		return true;
	}
}
