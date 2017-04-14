/**
  * CMAP
  */
import m from 'mithril';

import {AppModel} from './model/AppModel';
import {UI} from './ui/UI';

export class CMAP {

  init() {
    this.rootElement = document.getElementById('cmap-ui');
    this.appState = new AppModel({});
    this.UI = new UI(this.appState);
    m.mount(this.rootElement, this.UI);
    setInterval( () => m.redraw(), 1000);
  }
}
