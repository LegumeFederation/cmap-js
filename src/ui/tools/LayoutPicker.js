/**
 * LayoutPicker
 * A mithril component of radio buttons to select from available layouts.
 */
import m from 'mithril';
import PubSub from 'pubsub-js';

import toolState from '../../state/ToolState';
import {layout} from '../../topics';
import {horizontalLayout, circosLayout} from '../../layouts';

export class LayoutPicker  {

  onchange(e) {
    let l = e.target.value;
    toolState.layout = l;
    e.redraw = false;
    PubSub.publish(layout, { evt: e, layout: l });
  }

  view(vnode) {
    return m('fieldset',
      vnode.attrs,
      vnode.children && vnode.children.length ?
      vnode.children :
      [
        m('legend', 'layout:'),
        m('label', { for: 'horizontal-radio'}, [
          m('input', {
            type: 'radio',
            name: 'layout',
            value: horizontalLayout,
            id: 'horizontal-radio',
            checked: toolState.layout === horizontalLayout,
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
            checked: toolState.layout === circosLayout,
            onchange: e => this.onchange(e)
          }),
          'circos'
        ])
      ]
    );
  }
}
