/**
  * Feature
  * A mithril component for displaying feature information.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {featureUpdate, reset} from '../../topics';

import {mix} from '../../../mixwith.js/src/mixwith';
import {Menu} from './Menus';
import {RegisterComponentMixin} from '../RegisterComponentMixin';

export class FeatureMenu extends mix(Menu).with(RegisterComponentMixin){

  oninit(vnode){
    super.oninit(vnode);
  }
   
  /**
   * mithril component render method
   */
  view(vnode) {
    let info = vnode.attrs.info || {};
    info.selectedId = "none";
    let bounds = vnode.attrs.bounds || {};
    let order = vnode.attrs.order || 0;
    let modal = this;
    let pV = '';
    return m('div', {
       class: 'feature-menu',
       style: `position:absolute; left: 0px; top: 0px; width:${bounds.width}px;height:${bounds.height}px`,
       onclick: function(){console.log('what',this);}
     },[this._inner(info,order), m('button',{onclick: function(){ console.log('what what', info.selectedId);
       PubSub.publish(featureUpdate, null);
       vnode.dom.remove(vnode);}},'close modal')]);
  }


  _inner(data,order){
    let settings = data.parent.parent.model.qtlGroups[order];
    let tagList = data.parent.parent.model.tags;
    this.selectedId = settings.filter;
    data.selectedId = this.selectedId;
    this.data = tagList;
    console.log("info", data,settings,tagList);
    return m('select',{onchange: function(e){settings.filter = e.target.value;}},[tagList.map(tag => {
      return m('option',{ value:tag}, tag);
      })
    ])
  }

	handleGesture(){
		// prevent interacting with div from propegating events
		return true;
	}
}
