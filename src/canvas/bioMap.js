/*
 * Canvas component rendering a Map. Would have been named just 'Map' but Js
 * now has a Map object.
*/
import m from 'mithril';

export class BioMap {

  view() {
    return m('canvas', {class: 'cmap-canvas'});
  }
}
