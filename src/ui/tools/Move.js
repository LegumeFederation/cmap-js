/**
 * Move
 * A mithril component of a Move tool.
 */
import m from 'mithril';

import toolState from '../../state/ToolState';
//import icon from '../svg-icons/move.svg';
const icon =''; // FIXME: support loading svg as raw text?

export class Move  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click() {
    if(! this.active()) {
      this.toolState.activeTool = 'move';
    }
  }

  active() {
    return this.toolState.activeTool === 'move';
  }

  view() {
    return m('button', {
        class: this.active() ? 'pure-button pure-button-active' : 'pure-button',
        onclick: () => this.click()
      },
      [
        'Move',
        m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
      ]
    );
  }
}
