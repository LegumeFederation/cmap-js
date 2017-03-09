/*
* A component to wrap the selected layout component inside of a clipping region
* overflow: hidden in css.
*/
import m from 'mithril';
import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';
import * as layouts from '../../layouts';
import {layout as layoutMsg, zoomMouseWheel, reset} from '../../topics';
import toolState from '../../state/ToolState';
import {domRectEqual} from '../../util/domRect';

export class Layout {

  constructor() {
    this.toolState = toolState;
    this.horizontalLayout = new HorizontalLayout();
    this.circosLayout = new CircosLayout();
  }

  oninit(vnode) {
    this.subscriptions = [
      PubSub.subscribe(layoutMsg, (msg, data) => this.onLayoutChange(msg, data)),
      PubSub.subscribe(zoomMouseWheel, (msg, data) => this.onZoom(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this.onReset(msg, data))
    ];
  }

  onReset(msg, data) {
    this.relativeBounds = null;
    this._updateRelativeBounds(this.toolState.zoomFactor);
    if(! data.evt.redraw) m.redraw();
  }

  onZoom(msg, data) {
    this._updateRelativeBounds(data.zoomFactor);
    if(! data.evt.redraw) m.redraw();
  }

  onLayoutChange(msg, data) {
    if(! data.evt.redraw) m.redraw();
  }

  oncreate(vnode) {
    this._updateBounds(vnode);
  }

  onupdate(vnode) {
    this._updateBounds(vnode);
  }

  _updateBounds(vnode) {
    let newBounds = vnode.dom.getBoundingClientRect();
    // dont update state and redraw unless the bounding box has changed
    if(domRectEqual(this.bounds, newBounds)) return;
    this.bounds = newBounds;
    console.log(this.bounds);
    this._updateRelativeBounds(this.toolState.zoomFactor);
    m.redraw();
  }

  _updateRelativeBounds(zoomFactor) {
    if( ! this.relativeBounds
       || zoomFactor === 0
       || this.relativeBounds.width < 0.5 * this.bounds.width) {
      this.relativeBounds = {
        top: 0,
        left: 0,
        width: this.bounds.width,
        height: this.bounds.height
      };
    }
    else {
      this.relativeBounds = {
        top: 0,
        left: 0,
        width: this.relativeBounds.width +
          window.innerWidth * -1 * (zoomFactor / window.innerWidth),
        height: this.relativeBounds.height +
          window.innerHeight * -1 * (zoomFactor / window.innerHeight),
      };
    }
    let aspect = this.relativeBounds.width / this.relativeBounds.height;
    console.log(`aspect ratio: ${aspect}`);
  }

  view() {
    let b = this.relativeBounds || {};
    console.log(b);
    return m('div', { class: 'cmap-layout-viewport cmap-hbox'}, [
      m('div', {
        class: 'cmap-layout-content',
        style: `top: ${b.top}px; left: ${b.left}px; width: ${b.width}px; height: ${b.height}px`
      }, [
        this.toolState.layout === layouts.horizontalLayout
        ?
        m(this.horizontalLayout)
        :
        m(this.circosLayout)
      ])
    ]);
  }
}
