/*
* A component to wrap the selected layout component inside of a clipping region
* overflow: hidden in css.
*/
import m from 'mithril';
import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';

export class Layout {

  view() {
    return m('div', { class: 'cmap-layout'}, [
    ]);
  }
}
