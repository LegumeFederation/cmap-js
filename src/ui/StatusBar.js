/**
  * StatusBar
  * A mithril component of a status bar
  */
import m from 'mithril';

export class StatusBar {

  // constructor() - prefer do not use in mithril components

  view() {
    return m('div', { class: 'cmap-hbox' }, 'footer/status bar');
  }
}
