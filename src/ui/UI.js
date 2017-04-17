/**
  * UI
  * A mithril component presenting all DOM aspects of user-interface.
  */
import m from 'mithril';

//import {Tools} from './tools/Tools';
import {StatusBar} from './StatusBar';
import {LayoutContainer} from './layout/LayoutContainer';

export class UI {

  constructor(appState) {
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
          //m(Tools, childAttrs)
          m('div', { class: 'cmap-layout-viewport cmap-hbox'},
            m(LayoutContainer, childAttrs)
          ),
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
