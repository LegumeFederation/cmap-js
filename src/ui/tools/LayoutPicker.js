/*
 * A slider component to test layouts with varying number of canvases
*/
import m from 'mithril';
import toolState from '../../state/ToolState';
import {layout} from '../../topics';
import {horizontalLayout, circosLayout} from '../../layouts';

export class LayoutPicker  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  onchange(e) {
    let l = e.target.value;
    this.toolState.layout = l;
    e.redraw = false;
    PubSub.publish(layout, { evt: e, layout: l });
  }

  view() {
    return m('fieldset', {}, [
      m('legend', 'layout:'),
      m('label', { for: 'horizontal-radio'}, [
        m('input', {
          type: 'radio',
          name: 'layout',
          value: horizontalLayout,
          id: 'horizontal-radio',
          checked: this.toolState.layout === horizontalLayout,
          onchange: e => this.onchange(e)
        }),
        'horizontal'
      ]),
      m('label', { for: 'circos-radio'}, [
        m('input', {
          type: 'radio',
          name: 'layout',
          value: circosLayout,
          id: 'circos-radio',
          checked: this.toolState.layout === circosLayout,
          onchange: e => this.onchange(e)
        }),
        'circos'
      ])
    ]);
  }
}
