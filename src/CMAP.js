/**
  * CMAP
  */
import m from 'mithril';

import {AppModel} from './model/AppModel';
import {UI} from './ui/UI';

/* istanbul ignore next: mithril-query does not work with m.mount, and dom id is hardcoded as well */
export class CMAP {

  init() {
    this.rootElement = document.getElementById('cmap-ui');
    this.appState = new AppModel({});
    this.UI = new UI(this.appState);
    m.mount(this.rootElement, this.UI);
  }
}
