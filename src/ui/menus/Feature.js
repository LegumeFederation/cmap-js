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
    this.tagList = vnode.attrs.info.parent.parent.model.tags.sort();
    this.settings = vnode.attrs.info.parent.parent.model.qtlGroups[vnode.attrs.order];
    console.log('dd mod set',this.settings);
    this.selected = this.settings.filter.map( item => {
      return {name: item, 
              index: this.tagList.indexOf(item)}
    });
    console.log('dd mod set',this.selected);
  }
   
  /**
   * mithril component render method
   */
  view(vnode) {
    let info = vnode.attrs.info || {};
    let bounds = vnode.attrs.bounds || {};
    let order = vnode.attrs.order || 0;
    let modal = this;
    modal.rootNode = vnode;

    return m('div', {
       class: 'feature-menu',
       style: `position:absolute; left: 0px; top: 0px; width:${bounds.width}px;height:${bounds.height}px`,
       onclick: function(){console.log('what',this);}
     },[this._dropdownDiv(modal), this._applyButton(modal), this._closeButton(modal)]);
  }

  _dropdownDiv(modal){
    var dropdowns = [];
    for(var i = 0; i < modal.selected.length; i++){
      var settings = {
        name: modal.settings.filter[i], 
        trackColor: modal.settings.trackColor[i] || modal.settings.trackColor[0],
        tags: modal.tagList
      };
      if(modal.selected[i].index === -1){
        modal.selected[i].index = settings.tags.indexOf(settings.name);
      }

      dropdowns[i] = this._dropDown(modal,settings,i);
    };

    return m('div',{class:'dropdown-container',
        style: `height:90%`
      },m('div',[dropdowns]));
  }
  
  _applyButton(modal){
     return  m('button',{
        onclick: function(){
          modal.settings.filter = modal.selected[0].name;
          modal.settings.filter = modal.selected.map( selected => {
            return selected.name;
          });
          PubSub.publish(featureUpdate, null);
          modal.rootNode.dom.remove(modal.rootNode);
        }
      },'Apply Selection');
  }

  _closeButton(modal){
     return  m('button',{
        onclick: function(){
          modal.rootNode.dom.remove(modal.rootNode);
        }
      },'Close');
  }

  _dropDown(modal,settings,order){
    let selector = this;
    return m('div',m('select',{
      id:`selector-${order}`,
      selectedIndex : selector.selected[order].index,
      oninput: (e)=>{
        var selected = e.target.selectedIndex;
        selector.selected[order].name = settings.tags[selected];
        selector.selected[order].index = selected;
       }
    },[settings.tags.map(tag => {
      return m('option', tag);
      })
    ]),m('button',{onclick : e =>{
      selector.selected[selector.selected.length] = {index:0};
    }},'+'),m('button',{onclick: e => {
      selector.selected.splice(order,1);}},'-'))
  }

	handleGesture(e){
		// prevent interacting with div from propegating events
    console.log('hammer time',e);
    return true;
	}
}

