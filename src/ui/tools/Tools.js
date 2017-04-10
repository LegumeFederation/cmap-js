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

  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({class: 'tools cmap-hbox'}, srcAttrs);
    return m('div',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children : [ m(DevMapsSlider), m(LayoutPicker), m(Reset)]
    );
  }
}
