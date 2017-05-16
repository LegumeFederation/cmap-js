/**
  * StatusBar
  * A mithril component of a status bar and/or footer.
  */
import m from 'mithril';

export class StatusBar {

  // constructor() - prefer do not use in mithril components
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  view() {
    return m('div', [
      m('div.cmap-attribution', this.appState.attribution),
      m('div.cmap-footer', [
        this.appState.busy ? m('img[src=images/ajax-loader.gif]') : '',
        this.appState.status
      ])
    ]);
  }
}
