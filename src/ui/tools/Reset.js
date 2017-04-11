/**
 * Reset
 * A mithril component of a Reset button.
 */
import m from 'mithril';

import toolState from '../../state/ToolState';
// import icon from '../svg-icons/move.svg'; // TODO button icon


export class Reset  {

  click() {
    toolState.reset();
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
        'Reset',
        //m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
      ]
    );
  }
}
