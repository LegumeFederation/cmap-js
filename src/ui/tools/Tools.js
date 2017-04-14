/**
  * Tools
  * A mithril component of the UI tools in a div.
  */
import m from 'mithril';

//import {Move} from './Move';
import {Reset} from './Reset';
//import {NewMap} from './NewMap';
import {DevMapsSlider} from './DevMapsSlider';
import {LayoutPicker} from './LayoutPicker';


export class Tools  {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   * mithril component render method
   */
  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({class: 'tools cmap-hbox'}, srcAttrs);
    return m('div',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children : [
          m(DevMapsSlider, { appState: this.appState }),
          m(LayoutPicker, { appState: this.appState }),
          m(Reset, { appState: this.appState })
        ]
    );
  }
}
