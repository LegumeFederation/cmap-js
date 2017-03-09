import m from 'mithril';
import toolState from '../../state/ToolState';
//import icon from '../svg-icons/zoom-in.svg';
import {newMap} from '../../topics';

export class NewMap  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click() {
    PubSub.publish(newMap, null);
  }

  view() {
      return m('button', {
          class: 'pure-button',
          onclick: () => this.click()
        },
        [
          'New Map'
          //,
          //m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
        ]
      );
    }
}
