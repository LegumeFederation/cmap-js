import m from 'mithril';
import toolState from '../state/toolState';
import {Move} from './tools/move';
import {Zoom} from './tools/zoom';

export class Tools  {

  constructor() {
    this.move = new Move();
    this.zoom = new Zoom();
    this.toolState = toolState;
  }

  view() {
    console.log(toolState);
    return m('div', { class: 'tools' }, [
      m('span', `you are currently ${toolState.activeTool}-ing`),
      m(this.move, {toolState: this.toolState }),
      m(this.zoom, {toolState: this.toolState })
    ]);
  }
}
