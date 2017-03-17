/*
 * Canvas component rendering a Map. Would have been named just 'Map' but Js
 * now has a Map object.
*/
import m from 'mithril';
import {domRectEqual} from '../util/domRect';

export class BioMap {

  setBounds(b) {
    if(! domRectEqual(this.bounds, b)) {
      this.bounds = b;
    }
  }

  view() {
    return m('canvas', {
      class: 'cmap-canvas',
      style: this.bounds ?
            `left: ${this.bounds.left}px; top: ${this.bounds.top}px;
            width: ${this.bounds.width}px; height: ${this.bounds.height}px;`
            : '',
      width: this.bounds ? this.bounds.width : '',
      height: this.bounds ? this.bounds.height : '',
    });
  }
}
