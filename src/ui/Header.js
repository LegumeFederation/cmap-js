/**
 * Header
 */
import m from 'mithril';

export class Header {
  // constructor() - prefer do not use in mithril components
  /**
   * mithril lifecycle method
   * @param vnode
   */

  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   * Mithril lifecycle component
   * @returns {*} cmap-header
   */

  view() {
    return m('div.cmap-hbox',
      m('h4.cmap-header', [
        'cmap-js ',
        m('span.cmap-header', this.appState.header)
      ]));
  }
}
