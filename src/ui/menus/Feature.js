/**
  * Feature
  * A mithril component for displaying feature information.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {featureUpdate, reset} from '../../topics';

import {mix} from '../../../mixwith.js/src/mixwith';
import {Menu} from './Menus';
import {Dropdown} from './Dropdown';
import {RegisterComponentMixin} from '../RegisterComponentMixin';

export class FeatureMenu extends mix(Menu).with(RegisterComponentMixin){

  oninit(vnode){
    super.oninit(vnode);
    this.tagList = vnode.attrs.info.parent.parent.model.tags.sort();
    this.settings = vnode.attrs.info.parent.parent.model.qtlGroups[vnode.attrs.order];
    this.selected = [{ name: this.settings.filter, index: this.tagList.indexOf(this.settings.filter)}];
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
    console.log('dd',modal.settings);
    var settings = [{filter: modal.settings.filter,tags:modal.tagList},{filter:'QTL_root',tags:modal.tagList}];
    console.log('dd', settings); 
    console.log('dd set',modal.settings);
    console.log('dd set arr',modal.settings);
    console.log('dd set typeof', typeof [modal.settings] === 'array');
    for(var i = 0; i < modal.selected.length; i++){
      dropdowns[i] = this._dropDown(modal,settings[0],i);
    };
    console.log('bleep dropdowns', dropdowns);

    return m('div',{class:'dropdown-container',
        style: `height:90%`
      },m('div',[dropdowns,m(new Dropdown())]));
  }
  
  _applyButton(modal){
     return  m('button',{
        onclick: function(){
          console.log('dd what what', modal.settings, modal.selected);
          modal.settings.filter = modal.selected[0].name;
          modal.settings.filter = modal.selected.map( selected => {
            return selected.name;
          });
          console.log('dd what settings',modal.settings);
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
    if(!selector.selected[order]){
      selector.selected[order] = {index:0};
    }
    console.log('dd init',selector.selected[order]);
    return m('div',m('select',{
      id:`selector-${order}`,
      selectedIndex : selector.selected[order].index,
      onmouseout: (e)=>{
        selector.selected[order].name = settings.tags[e.target.options.selectedIndex];
        selector.selected[order].index = e.target.options.selectedIndex;
       },
      onclose: (e) => {
        console.log('dd click out',e);
      },
      onmousedown: (e) => {
        console.log('dd click down',e);
      }
    },[settings.tags.map(tag => {
      return m('option',{onclose: (e) => {console.log('dd click onsel');}}, tag);
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

