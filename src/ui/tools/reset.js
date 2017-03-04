import m from 'mithril';
import toolState from '../../state/toolState';
// import icon from '../svg-icons/move.svg'; // TODO button icon


export class Reset  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click() {
    this.toolState.reset();
  }

  view() {
    return m('button', {
        class: 'pure-button',
        onclick: () => this.click()
      },
      [
        'Reset',
        //m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
      ]
    );
  }
}
