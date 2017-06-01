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
       //style: `left: ${info.left+b.left}px; top: ${info.top+b.top}px;
       //        width: 15em; height: 10em; border:1px solid #bbb;
       //        background: white; visibility: ${info.visible};
       //        position: absolute; display: inline-block; overflow-y:auto;
       //        z-index:10000; border-radius:4px;`,
       style: `left: ${info.left+b.left}px; top: ${info.top+b.top}px;
               visibility: ${info.visible};`,
     },this._generateInner(info.data));
  }

  _generateInner(data){
    if(!data) return;

    let bob = data.map(item => {
      console.log('popitem',item);
      let start = m('div', 'start:  '+ item.model.coordinates.start);
      let stop = m('div', 'stop:  '+ item.model.coordinates.stop);
      let tags = item.model.tags.length > 0 && typeof item.model.tags[0] != 'undefined' ? m('div','tags:  ',item.model.tags.join('\n')) : [];
      let aliases = item.model.aliases.length > 0 && item.model.aliases[0] != 'undefined'  ?  m('div','aliases:  ',item.model.aliases.join('\n')) : [];
      return [m('div',{class:'biomap-info-name'},item.model.name),
        m('div',{class:'biomap-info-data'},[start,stop,tags, aliases])
      ];
    });
    
    return m('div',{},bob);
  }


	handleGesture(){
		// prevent interacting with div from propegating events
		return true;
	}
}
