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

export class FeatureMenu extends mix(Menu).with(RegisterComponentMixin) {

  oninit(vnode) {
    super.oninit(vnode);
    this.tagList = vnode.attrs.info.parent.parent.model.tags.sort();
    this.settings = vnode.attrs.info.parent.parent.model.qtlGroups[vnode.attrs.order];
    this.groupTags = vnode.attrs.info.tags;
    this.selected = {name: this.settings.filter, index: this.tagList.indexOf(this.settings.filter)};
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
      onclick: function () {
        console.log('what', this);
      }
    }, [this._dropDown(modal), this._applyButton(modal), this._closeButton(modal)]);
  }

  _applyButton(modal) {
    return m('button', {
      onclick: function () {
        console.log('what what', modal.settings);
        modal.settings.filter = modal.selected.name;
        modal.groupTags[0] = modal.selected.name;
        PubSub.publish(featureUpdate, null);
        modal.rootNode.dom.remove(modal.rootNode);
      }
    }, 'Apply Selection');
  }

  _closeButton(modal) {
    return m('button', {
      onclick: function () {
        modal.rootNode.dom.remove(modal.rootNode);
      }
    }, 'Close');
  }

  _dropDown(modal) {
    console.log('what inner', modal, modal.rootNode);
    let selector = this;
    return m('select', {
      selectedIndex: selector.selected.index,
      onchange: function (e) {
        console.log('selected on drop', this, e);
        selector.selected.name = e.target.value;
        selector.selected.index = modal.tagList.indexOf(e.target.value);
      }
    }, [modal.tagList.map(tag => {
      return m('option', tag);
    })
    ]);
  }

  handleGesture() {
    // prevent interacting with div from propegating events
    return true;
  }
}
