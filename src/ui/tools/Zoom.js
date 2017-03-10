import m from 'mithril';
import toolState from '../../state/ToolState';
import icon from '../svg-icons/zoom-in.svg';
import {zoomMouseWheel} from '../../topics';
import './wheelListener';

export class Zoom  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click(e) {
    if(! this.active()) {
      this.toolState.activeTool = 'zoom';
    }
  }

  oncreate() {
    addWheelListener(window, (e) => this._onWheel(e));
  }

  _onWheel(evt) {
    evt.preventDefault();
    let deltaY = Math.floor(evt.deltaY);
    // accumulate the positive or negative zoom factor (units: vertical pixels)
    this.toolState.zoomFactor += deltaY;
    PubSub.publish(zoomMouseWheel, { evt: evt, deltaY: deltaY });
  }

  active() {
    return this.toolState.activeTool === 'zoom';
  }

  view() {
      return m('button', {
          class: this.active() ? 'pure-button pure-button-active' : 'pure-button',
          onclick: (e) => this.click(e)
        },
        [
          'Zoom',
          m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
        ]
      );
    }
}
