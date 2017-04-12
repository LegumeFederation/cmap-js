/**
  * CMAP
  */
import m from 'mithril';

import {App} from './model/App';
import {UI} from './ui/UI';

export class CMAP {

  init() {
    this.appState = new App({});
    this.UI = new UI(this.appState);
    this.rootElement = document.getElementById('cmap-ui');
    m.mount(this.rootElement, this.UI);
  }
}
