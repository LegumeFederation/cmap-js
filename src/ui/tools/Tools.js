/**
  * A mithril component of the UI tools in a div (toolbar).
  */
import m from 'mithril';

import {ResetButton} from './ResetButton';
import {RemoveMapButton} from './RemoveMapButton';
import {AddMapButton} from './AddMapButton';
import {FilterButton} from './FilterButton';

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
    return m('div.tools.cmap-hbox', [
      m(ResetButton),
      m(FilterButton),
      m(AddMapButton),
      m(RemoveMapButton)
    ]);
  }
}
