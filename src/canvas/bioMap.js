/*
 * Canvas component rendering a Map. Would have been named just 'Map' but Js
 * now has a Map object.
*/
import m from 'mithril';

export class BioMap {

  // set the width, height of this canvas
  setBounds(bounds) {
    this.bounds = bounds;
  }

  view() {
    return m('canvas', {
      class: 'cmap-canvas',
      width: this.bounds.width,
      height: this.bounds.height,
      style: `left: ${this.bounds.left}px; top: ${this.bounds.top}px`
    });
  }
}
