/**
  * Feature
  * A mithril component for displaying feature information.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {featureUpdate, reset} from '../../topics';

import {mix} from '../../../mixwith.js/src/mixwith';
import {Menu} from './Menus';

export class FeatureMenu extends Menu {

  oninit(vnode){
    //super.oninit(vnode);
    this.tagList = vnode.attrs.info.parent.parent.model.tags.sort();
    console.log('feature menu test',vnode.attrs);
    this.order = vnode.attrs.order;
    var model= vnode.attrs.info.parent.parent.model;
    if(!model.qtlGroups){
      model.qtlGroups = [];
      this.order = 0;
    }
    if(!model.qtlGroups[this.order]){
      model.qtlGroups[this.order] = {filter:[this.tagList[0]],trackColor:['red']}
    }
    this.settings = model.qtlGroups[this.order];
    this.selected = this.settings.filter.map( item => {
      return {name: item, 
              index: this.tagList.indexOf(item)};
    });
  }
  /**
   * mithril component method
   */
	oncreate(vnode) {
    // using super here attaches handleGesture() to the mithril component
    super.oncreate(vnode);
  }
  /**
   * mithril component render method
   */
  view(vnode) {
    let bounds = vnode.attrs.bounds || {};
    let modal = this;
    modal.rootNode = vnode;

    return m('div', {
       class: 'feature-menu',
       style: `position:absolute; left: 0px; top: 0px; width:${bounds.width}px;height:${bounds.height}px`,
       onclick: function(){console.log('what',this);}
     },[this._dropdownDiv(modal), this._applyButton(modal), this._closeButton(modal),this._removeButton(modal,vnode)]);
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
    }

    return m('div',{class:'dropdown-container',
        style: 'height:90%'
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
          m.redraw();
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

  _removeButton(modal,vnode){
     return  m('button',{
       style:'background-color:red;',
        onclick: function(){
          vnode.attrs.info.parent.parent.model.qtlGroups.splice(modal.order,1);
          PubSub.publish(featureUpdate, null);
          m.redraw();
          modal.rootNode.dom.remove(modal.rootNode);
        }
      },'Remove Track');
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
    ]),m('button',{onclick : () =>{
      selector.selected[selector.selected.length] = {index:0};
    }},'+'),m('button',{onclick: () => {
      selector.selected.splice(order,1);}},'-'));
  }

	handleGesture(){
		// prevent interacting with div from propegating events
    return true;
	}
}

