/**
 * CircosLayout
 * A mithril component for circos-style layout of BioMaps.
 */
import m from 'mithril';
import * as mixwith from '../../../mixwith.js/src/mixwith.mjs';
const { mix } = mixwith;

import {LayoutBase} from './LayoutBase.js';
import {Bounds} from '../../model/Bounds.js';
import {RegisterComponentMixin} from '../RegisterComponentMixin.js';

const radians = degrees => degrees * Math.PI / 180;

//const degrees = radians => radians * 180 / Math.PI; // TODO: remove if unused

export class CircosLayout
  extends mix(LayoutBase)
    .with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components
  /**
   *
   * @private
   */

  _layout() {
    let domRect = this.el.getBoundingClientRect();
    if (!domRect.width || !domRect.height) {
      // may occur when component is created but dom element has not yet filled
      // available space; expect onupdate() will occur.
      console.warn('deferring layout');
      return;
    }
    let newBounds = new Bounds(domRect);
    let dirty = !Bounds.equals(this.domBounds, newBounds);
    this.domBounds = newBounds;
    /* update child elements with their bounds */
    let radius = this.domBounds.width > this.domBounds.height
      ? this.domBounds.height * 0.4 : this.domBounds.width * 0.4;
    let n = this.bioMaps.length;
    let center = {
      x: Math.floor(this.domBounds.width * 0.5),
      y: Math.floor(this.domBounds.height * 0.5)
    };
    let degreesPerChild = 360 / n;
    let childWidth = Math.floor(1.1 * this.domBounds.width / n);
    let childHeight = Math.floor(childWidth * 0.6);
    let startDegrees = -180;
    let degrees = startDegrees;
    this.bioMaps.forEach(child => {
      let rad = radians(degrees);
      let x = center.x - Math.floor(childWidth * 0.5) + Math.floor(radius * Math.cos(rad));
      let y = center.y - Math.floor(childHeight * 0.5) + Math.floor(radius * Math.sin(rad));
      // noinspection JSSuspiciousNameCombination
      // noinspection JSSuspiciousNameCombination
      child.domBounds = new Bounds({
        left: x,
        top: y,
        width: childHeight, // swap the width and height
        height: childWidth
      });
      child.rotation = Math.floor(degrees) + startDegrees;
      degrees += degreesPerChild;
    });
    if (dirty) m.redraw();
  }

  /* mithril render callback */
  /**
   *
   * @returns {*}
   */
  view() {
    return m('div.cmap-layout-circos',
      this.children.map(m)
    );
  }
}
