/**
 * Reset
 * A mithril component of a Reset button.
 */
import m from 'mithril';

// import icon from '../svg-icons/move.svg'; // TODO button icon


export class Reset  {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.state = vnode.attrs.state;
  }

  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({
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

  /**
   * button's event handler
   */
  click() {
    // FIXME: implement appState reset
    this.state.reset();
  }
}
