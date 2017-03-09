/*
* A component to wrap the selected layout component inside of a clipping region
* overflow: hidden in css.
*/
import m from 'mithril';
import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';
import * as layouts from '../../layouts';
import {layout as layoutMsg} from '../../topics';
import toolState from '../../state/ToolState';

export class Layout {

  constructor() {
    this.toolState = toolState;
    this.horizontalLayout = new HorizontalLayout();
    this.circosLayout = new CircosLayout();
    PubSub.subscribe(layoutMsg, (l) => this.onLayoutChange(l));
  }

  onLayoutChange(msg) {
    if(! msg.evt.redraw) m.redraw();
  }

  view() {
    return m('div', { class: 'cmap-layout'}, [
      this.toolState.layout === layouts.horizontalLayout
      ?
      m(this.horizontalLayout)
      :
      m(this.circosLayout)
    ]);
  }
}
