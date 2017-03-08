/*
 * Canvas component rendering a Map. Would have been named just 'Map' but Js
 * now has a Map object.
*/
import m from 'mithril';
import {domRectEqual} from '../util/domRect';

export class BioMap {

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
    m.redraw();
  }

  view() {
    return m('div', { class: 'cmap-stretch cmap-canvas-wrapper' },
      m('canvas', {
        class: 'cmap-canvas',
        width: this.bounds ? Math.floor(this.bounds.width) - 10 : '',
        height: this.bounds ? Math.floor(this.bounds.height) - 10 : '',
      })
    );
  }
}
