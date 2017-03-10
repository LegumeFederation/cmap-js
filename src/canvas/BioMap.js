/*
 * Canvas component rendering a Map. Would have been named just 'Map' but Js
 * now has a Map object.
*/
import m from 'mithril';
import {domRectEqual} from '../util/domRect';

export class BioMap {

  view() {
    return m('canvas', {
      class: 'cmap-canvas',
      width: this.bounds ? Math.floor(this.bounds.width) : '',
      height: this.bounds ? Math.floor(this.bounds.height) : '',
    });
  }
}
