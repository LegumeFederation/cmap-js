/**
 * StatusBar
 * A mithril component of a status bar and/or footer. NOTE: currently unused
 */
import m from 'mithril';

export class StatusBar {

  // constructor() - prefer do not use in mithril components
  /**
   *
   * @param vnode
   */

  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   *
   * @returns {*}
   */

  view() {
    return m('div', [
      m('div.cmap-attribution', this.appState.attribution),
      m('div', {id: 'cmap-disclaimer'}, 'cmap-js is still in alpha. As the software is still in development, the current state of the project may not reflect the final release.'),
      m('div.cmap-footer', [
        this.appState.busy ? m('img[src=images/ajax-loader.gif]') : '',
        this.appState.status
      ])
    ]);
  }
}
