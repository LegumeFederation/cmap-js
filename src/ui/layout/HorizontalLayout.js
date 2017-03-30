/**
 * A mithril component for horizontal layout of BioMaps.
 */
import m from 'mithril';

import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../util/Bounds';
import toolState from '../../state/ToolState';

export class HorizontalLayout extends LayoutBase {

  _layout(domElement) {
    // keep a reference so _.layout() can be called in response to other evts.
    this._domElement = domElement;
    let domRect = domElement.getBoundingClientRect();
    if(! domRect.width || ! domRect.height) {
      // may occur when component is created but dom element has not yet filled
      // available space; expect onupdate() will occur.
      return;
    }
    let newBounds = new Bounds(domRect);
    let dirty = ! Bounds.equals(this.domBounds, newBounds);
    this.domBounds = newBounds;
    /* update child elements with their bounds */
    let n = this.bioMaps.length;
    let padding = Math.floor(newBounds.width * 0.1 / n);
    let childWidth = Math.floor(newBounds.width / n - padding);
    let childHeight = Math.floor(newBounds.height);
    let cursor = Math.floor(padding * 0.5);
    this.bioMaps.forEach( child => {
      child.domBounds = new Bounds({
        left: cursor,
        top: 0,
        width: childWidth,
        height: childHeight
      });
      cursor += childWidth + padding;
    });
    if(dirty) m.redraw();
  }

  /* mithril render callback */
  view() {
    return m('div', {
        class: 'cmap-layout-horizontal'
      },
     this.children.map(m)
    );
  }
}
