/**
 * LayoutPicker
 * A mithril component of radio buttons to select from available layouts.
 */
import m from 'mithril';
import PubSub from 'pubsub-js';

import {layout} from '../../topics';
import {HorizontalLayout} from '../../ui/layout/HorizontalLayout';
import {CircosLayout} from '../../ui/layout/CircosLayout';


export class LayoutPicker  {

  // constructor() - prefer do not use in mithril components

  onchange(e) {
    let l = e.target.value;
    this.state.layout = l;
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
            value: HorizontalLayout,
            id: 'horizontal-radio',
            checked: this.state.tools.layout === HorizontalLayout,
            onchange: e => this.onchange(e)
          }),
          'horizontal'
        ]),
        m('label', { for: 'circos-radio'}, [
          m('input', {
            type: 'radio',
            name: 'layout',
            value: CircosLayout,
            id: 'circos-radio',
            checked: this.state.tools.layout === CircosLayout,
            onchange: e => this.onchange(e)
          }),
          'circos'
        ])
      ]
    );
  }
}
