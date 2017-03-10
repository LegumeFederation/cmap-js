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

  /* mitrhril component lifecycle functions */
  oninit(vnode) {
    this.subscriptions = [
      // layout change message
      PubSub.subscribe(layoutMsg, (msg, data) => this.onLayoutChange(msg, data)),
      PubSub.subscribe(zoomMouseWheel, (msg, data) => this.onZoom(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this.onReset(msg, data))
    ];
  }

  oncreate(vnode) {
    this._updateBounds(vnode);
  }

  onupdate(vnode) {
    this._updateBounds(vnode);
  }

  /* pub/sub callback functions */
  onReset(msg, data) {
    this.relativeBounds = null;
    this._applyZoomFactor(this.toolState.zoomFactor);
    if(! data.evt.redraw) m.redraw();
  }

  onZoom(msg, data) {
    this._applyZoomFactor(data.deltaY);
    if(! data.evt.redraw) m.redraw();
  }

  onLayoutChange(msg, data) {
    if(! data.evt.redraw) m.redraw();
  }


  _updateBounds(vnode) {
    let newBounds = vnode.dom.getBoundingClientRect();
    // dont update state and redraw unless the bounding box has changed
    if(domRectEqual(this.bounds, newBounds)) return;
    this.bounds = newBounds;
    this._applyZoomFactor(this.toolState.zoomFactor);
    m.redraw();
  }

  /*
   * deltaY is in vertical pixels of scroll
   * convert this to a factor by dividing into window.innerHeight
   * apply to the relativeBounds width and height, mainaining aspect ratio.
   */
  _applyZoomFactor(deltaY) {
    let minWidth = this.bounds.width * 0.5;
    if( ! this.relativeBounds || deltaY === 0) {
      this.relativeBounds = {
        top: 0,
        left: 0,
        width: this.bounds.width,
        height: this.bounds.height
      };
    }
    else {
      let factor = deltaY / window.innerHeight;
      let adjustWidth = this.relativeBounds.width * factor;
      let adjustHeight = this.relativeBounds.height * factor;
      let w = this.relativeBounds.width + adjustWidth;
      let h = this.relativeBounds.height + adjustHeight;
      this.relativeBounds = { top: 0, left: 0, width: w, height: h };
    }
  }

  view() {
    let b = this.relativeBounds || {};
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
