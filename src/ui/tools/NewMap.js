/**
 * NewMap
 * A mithril component of a new map button-- probably only useful for development
 * prototyping.
 */
import m from 'mithril';

import PubSub from 'pubsub-js';

//import icon from '../svg-icons/zoom-in.svg';
import {newMap} from '../../topics';

export class NewMap  {

  click(e) {
    e.redraw = false;
    PubSub.publish(newMap, { evt: e });
  }

  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({
        class: 'pure-button',
        onclick: (e) => this.click(e)
    }, srcAttrs);
    return m('button',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children :
        [
          'New Map'
          //,
          //m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
        ]
    );
  }
}
