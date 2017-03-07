import '../../node_modules/purecss/build/pure-min.css';
import '../../node_modules/purecss/build/grids-responsive-min.css';
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
    window.addEventListener('resize', () => this.resizeThrottler(), false);
  }

  view() {
    return  m('div', { class: 'content pure-g'}, [
       m('div', { class: 'pure-u-1-24' }),
       m('div', { class: 'pure-u-22-24' }, [
         // toolbar grid
         m('div', { class: 'pure-g'}, [
           m('div', { class: 'pure-u-1' }, [
              m('span', { class: 'cmap-logo' }, 'cmap-js'),
              m(this.tools)
           ])
         ]),
         // grid row for canvas
         m('div', { class: 'pure-g' }, [
            m(this.layout)
         ]),
         // status bar / footer grid
         m('div', { class: 'pure-g' }, [
           m('div', { class: 'pure-u-1'}, [
            m(this.statusBar)
           ])
         ])
       ]),
       m('div', { class: 'pure-u-1-24'})
    ]);
  }

  resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( ! this.resizeTimeout ) {
        this.resizeTimeout = setTimeout( () => {
        this.resizeTimeout = null;
        this.resize();
       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  resize() {
    m.redraw();
  }

}
