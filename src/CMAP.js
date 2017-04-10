/**
  * CMAP
  */
import m from 'mithril';

import {UI} from './ui/UI';

export class CMAP {

  init() {
    this.rootElement = document.getElementById('cmap-ui');
    m.mount(this.rootElement, UI);
  }
}
