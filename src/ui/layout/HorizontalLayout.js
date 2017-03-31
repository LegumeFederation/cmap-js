/**
  * HorizontalLayout
  * A mithril component for horizontal layout of BioMaps.
  */
import m from 'mithril';

import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../util/Bounds';
import toolState from '../../state/ToolState';

export class HorizontalLayout extends LayoutBase {

  /* mithril render callback */
  view() {
    return m('div', {
        class: 'cmap-layout-horizontal'
      },
     this.children.map(m)
    );
  }

  _layout(domElement) {
    // keep a reference to dom element so _.layout() can be called in response
    // to other evts.
    this._domElement = domElement;
    let domRect = domElement.getBoundingClientRect();
    if(! domRect.width || ! domRect.height) {
      // may occur when component is created but dom element has not yet filled
      // available space; expect onupdate() will fire and call _layout().
      return;
    }
    let newBounds = new Bounds(domRect);
    let dirty = ! Bounds.equals(this.domBounds, newBounds);
    this.domBounds = newBounds;
    this._layoutBioMaps();
    this._layoutCorrespondenceMaps();
    if(dirty) m.redraw();
  }

  _layoutBioMaps() {
    let n = this.bioMaps.length;
    let padding = Math.floor(this.domBounds.width * 0.1 / n);
    let childWidth = Math.floor(this.domBounds.width / n - padding);
    let childHeight = Math.floor(this.domBounds.height);
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
  }

  _layoutCorrespondenceMaps() {
    let n = this.correspondenceMaps.length;
    let padding = Math.floor(this.domBounds.width * 0.1 / n);
    let childWidth = Math.floor(this.domBounds.width / n - padding);
    let childHeight = Math.floor(this.domBounds.height);
    let cursor = Math.floor(padding * 0.5);
    this.correspondenceMaps.forEach( child => {
      child.domBounds = new Bounds({
        left: cursor,
        top: 0,
        width: childWidth,
        height: childHeight
      });
      cursor += childWidth + padding;
    });
  }

}
