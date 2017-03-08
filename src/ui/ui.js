import './css/cmap.css';

import m from 'mithril';
import {Tools} from './tools/tools';
import {StatusBar} from './statusBar';
import {HorizontalLayout} from './layout/horizontalLayout';


export class UI {

  constructor() {
    this.tools = new Tools();
    this.statusBar = new StatusBar();
    this.layout = new HorizontalLayout();
  }

  init() {
    // instantiate self as the root mitrhil component and
    // use component mount() to enable auto-rendering.
    let root = document.getElementById('cmap-ui');
    m.mount(root, this);

    // trigger mithril redraw when window is resized
    //window.addEventListener('resize', () => this.resizeThrottler(), false);
  }

  view() {
    return m('div', { class: 'cmap-layout cmap-vbox' }, [
      m(this.tools),
      m(this.layout),
      m('div', { class: 'cmap-hbox'}, 'footer')
    ])
  }

  resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( ! this.resizeTimeout ) {
        this.resizeTimeout = setTimeout( () => {
        this.resizeTimeout = null;
        this.resize()
       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  resize() {
    m.redraw();
  }

}
