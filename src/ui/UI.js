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
    this.state = appState;
  }

  /* mithril component lifecycle events */

  oncreate(vnode) {
    // TODO: remove these assertions once layouting is finalized
    let domRect = vnode.dom.getBoundingClientRect();
    console.assert(domRect.width > 0, 'missing width');
    console.assert(domRect.height > 0, 'missing height');
  }

  onupdate(vnode) {
    // TODO: remove these assertions once layouting is finalized
    let domRect = vnode.dom.getBoundingClientRect();
    console.assert(domRect.width > 0, 'missing width');
    console.assert(domRect.height > 0, 'missing height');
  }

  /* mithril component render callback */
  view(vnode) {
    let state = this.state;
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({class: 'cmap-layout cmap-vbox'}, srcAttrs);
    return m('div',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children : [
          m(Tools, { state }),
          m(LayoutContainer, { state }),
          m(StatusBar, { state })
        ]
    );
  }

  _logRenders() {
    if(! this.count) this.count = 0;
    this.count += 1;
    console.log(`*** mithril render #${this.count} ***`);
  }
}
