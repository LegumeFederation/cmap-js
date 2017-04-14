/**
  * UI
  * A mithril component presenting all DOM aspects of user-interface.
  */
import m from 'mithril';

import {Tools} from './tools/Tools';
import {StatusBar} from './StatusBar';
import {LayoutContainer} from './layout/LayoutContainer';

export class UI {

  constructor(appState) {
    // this is the only mithril component allowed to use a constructor for state
    // (because we have to inject the appState model into mithril somewhere)
    this.appState = appState;
  }

  /**
   * mithril component render callback
   */
  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({class: 'cmap-layout cmap-vbox'}, srcAttrs);
    let childAttrs = {
      appState: this.appState,
    };
    return m('div',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children : [
          m(Tools, childAttrs),
          m(LayoutContainer, childAttrs),
          m(StatusBar, childAttrs)
        ]
    );
  }

  _logRenders() {
    if(! this.count) this.count = 0;
    this.count += 1;
    console.log(`*** mithril render #${this.count} ***`);
  }
}
