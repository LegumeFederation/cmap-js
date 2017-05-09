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

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   * mithril component render method
   */
  view() {
    return m('fieldset', [
      m('legend', 'layout:'),
      m('label', { for: 'horizontal-radio'}, [
        m('input', {
          type: 'radio',
          name: 'layout',
          value: HorizontalLayout,
          id: 'horizontal-radio',
          checked: this.appState.tools.layout === HorizontalLayout,
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
          checked: this.appState.tools.layout === CircosLayout,
          onchange: e => this.onchange(e)
        }),
        'circos'
      ])
    ]
    );
  }

  /**
   * mithril event handler
   */
  onchange(e) {
    let l = e.target.value;
    this.appState.layout = l;
    e.redraw = false;
    PubSub.publish(layout, { evt: e, layout: l });
  }
}
