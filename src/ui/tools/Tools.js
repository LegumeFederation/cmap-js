/**
  * Tools
  * A mithril component of the UI tools in a div.
  */
import m from 'mithril';

import {Reset} from './Reset';

export class Tools  {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   * mithril component render method
   */
  view() {
    return m('div.tools.cmap-hbox', m(Reset));
  }
}
