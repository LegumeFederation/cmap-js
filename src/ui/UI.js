/**
 * A mithril component presenting all DOM aspects of user-interface.
 */
import m from 'mithril';

import './css/cmap.css';
import {Tools} from './tools/Tools';
import {StatusBar} from './StatusBar';
import {LayoutContainer} from './layout/LayoutContainer';


export class UI {

  constructor() {
    this.tools = new Tools();
    this.statusBar = new StatusBar();
    this.layout = new LayoutContainer();
  }

  init() {
    // instantiate self as the root mithril component and use component mount()
    // to enable auto-rendering.
    let rootElement = document.getElementById('cmap-ui');
    m.mount(rootElement, this);

    // trigger mithril redraw when window is resized
    //window.addEventListener('resize', () => this.resizeThrottler(), false);
  }

  // resizeThrottler() {
  //   // ignore resize events as long as an actualResizeHandler execution is in the queue
  //   if ( ! this.resizeTimeout ) {
  //       this.resizeTimeout = setTimeout( () => {
  //       this.resizeTimeout = null;
  //       this.resize()
  //      // The actualResizeHandler will execute at a rate of 15fps
  //      }, 66);
  //   }
  // }
  //
  // resize() {
  //   m.redraw();
  // }

  /* mithril component lifecycle events */

  oncreate(vnode) {
    let domRect = vnode.dom.getBoundingClientRect();
    console.assert(domRect.width > 0, 'missing width');
    console.assert(domRect.height > 0, 'missing height');
  }

  onupdate(vnode) {
    let domRect = vnode.dom.getBoundingClientRect();
    console.assert(domRect.width > 0, 'missing width');
    console.assert(domRect.height > 0, 'missing height');
  }

  /* mithril component render callback */
  view() {
    this._logRenders();
    return m('div', { class: 'cmap-layout cmap-vbox' }, [
      m(this.tools),
      m(this.layout),
      m('div', { class: 'cmap-hbox'}, 'footer')
    ])
  }

  _logRenders() {
    if(! this.count) this.count = 0;
    this.count += 1;
    console.log(`mithril render #${this.count}`);
  }
}
