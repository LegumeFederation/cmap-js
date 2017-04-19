/**
 * Header
 */
import m from 'mithril';

export class Header {
  // constructor() - prefer do not use in mithril components

  view() {
    return m('div.cmap-hbox', m('h4', 'cmap-js'));
  }
}
