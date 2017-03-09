import m from 'mithril';
import toolState from '../../state/ToolState';
// import icon from '../svg-icons/move.svg'; // TODO button icon


export class Reset  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click(e) {
    this.toolState.reset({ evt: e});
  }

  view() {
    return m('button', {
        class: 'pure-button',
        onclick: (e) => this.click(e)
      },
      [
        'Reset',
        //m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
      ]
    );
  }
}
