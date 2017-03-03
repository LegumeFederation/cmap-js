import m from 'mithril';
import { Tools } from './tools';
import normalizeCss from './css/normalize.css-min';
import skeletonCss from './css/skeleton.css-min';
import cmapCss from './css/cmap.css-min';

export class UI {

  constructor() {
    this.tools = new Tools();
  }

  init() {
    // instantiate self as the root mitrhil component
    let root = document.getElementById('cmap-ui');
    m.mount(root, this);
  }

  view() {
    return m('div', {}, [
      m('span', {class: 'logo'}, 'cmap-js'),
      m(this.tools)
    ]);
  }
}
