import m from 'mithril';
import toolState from '../../state/toolState';
//import icon from '../svg-icons/zoom-in.svg';
import {newMap} from '../../topics';

export class NewMap  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click() {
    if(! this.active()) {
      this.toolState.activeTool = 'zoom';
    }
    PubSub.publish(newMap, null);
  }

  active() {
    return this.toolState.activeTool === 'zoom';
  }

  view() {
      return m('button', {
          class: this.active() ? 'pure-button pure-button-active' : 'pure-button',
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
