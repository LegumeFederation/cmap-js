import m from 'mithril';
import toolState from '../../state/toolState';
import icon from '../svg-icons/zoom-in.svg';
import './wheelListener';

export class Zoom  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click() {
    if(! this.active()) {
      this.toolState.activeTool = 'zoom';
    }
  }

  oncreate() {
    addWheelListener(window, (e) => this._wheel(e));
  }

  _wheel(e) {
    this.toolState.zoomFactor = Math.floor(e.deltaY);
    m.redraw(); // this dom event came from outside mithril so manual redraw
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
          'Zoom',
          m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
        ]
      );
    }
}
