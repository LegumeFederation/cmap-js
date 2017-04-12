/**
  * HorizontalLayout
  * A mithril component for horizontal layout of BioMaps.
  */
import m from 'mithril';

import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../util/Bounds';
import {BioMap} from '../../canvas/BioMap';
import {CorrespondenceMap} from '../../canvas/CorrespondenceMap';

export class HorizontalLayout extends LayoutBase {

  // constructor() - prefer do not use in mithril components

  /* mithril lifecycle callbacks */

  /**
   * view() - mithril render callback. this is a pure function which maps
   * our appState to mithril components for rendering.
   */
  view() {
    return m('div', {
      class: 'cmap-layout-horizontal'
    },
    [].concat(
      this.state.bioMaps.map((bioMap) => {
        return m(BioMap, { state: bioMap, appState: this.state });
      }),
      this.state.correspondenceMaps.map((corMap) => {
        return m(CorrespondenceMap, { state: corMap, appState: this.state });
      })
    ));
  }

  _layout() {
    let domRect = this.el.getBoundingClientRect();
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
    //console.log(this.domBounds, dirty);
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
    let childWidth = Math.floor(this.domBounds.width / this.bioMaps.length);
    let childHeight = Math.floor(this.domBounds.height);
    let cursor = childWidth * 0.5;
    this.correspondenceMaps.forEach( (child, i) => {
      child.domBounds = new Bounds({
        left: cursor,
        top: 0,
        width: childWidth,
        height: childHeight
      });
      child.bioMaps = {
        left: this.bioMaps[i],
        right: this.bioMaps[i+1]
      };
      //console.log(child.bioMaps);
      cursor += childWidth;
    });
  }

}
