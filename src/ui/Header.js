/**
 * Header
 */
import m from 'mithril';

export class Header {
  // constructor() - prefer do not use in mithril components

  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  view() {
    return m('div.cmap-hbox', m('h4', [
      'cmap-js ',
      m('span.cmap-header', this.appState.header)
    ]));
  }
}
