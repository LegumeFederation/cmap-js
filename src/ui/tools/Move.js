/**
 * Move
 * A mithril component of a Move tool.
 */
import m from 'mithril';

import toolState from '../../state/ToolState';
//import icon from '../svg-icons/move.svg';
const icon =''; // FIXME: support loading svg as raw text?

export class Move  {

  click() {
    if(! this.active()) {
      toolState.activeTool = 'move';
    }
  }

  active() {
    return toolState.activeTool === 'move';
  }

  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({
        class: this.active() ? 'pure-button pure-button-active' : 'pure-button',
        onclick: () => this.click()
      },
      srcAttrs
    );
    return m('button',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children :
        [
          'Move',
          m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
        ]
    );
  }
}
