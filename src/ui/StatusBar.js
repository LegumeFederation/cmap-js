/**
  * StatusBar
  * A mithril component of a status bar
  */
import m from 'mithril';

export class StatusBar {

  view() {
    return m('div', { class: 'cmap-hbox' }, 'footer/status bar');
  }
}
