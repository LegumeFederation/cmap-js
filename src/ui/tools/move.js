import m from 'mithril';
import icon from '../svg-icons/move.svg';

export class Move  {

  oninit(vnode) {
    this.toolState = vnode.attrs.toolState;
  }

  click() {
    if(! this.active()) {
      this.toolState.activeTool = 'move';
    }
    console.log(this.toolState);
//    m.redraw();
  }

  active() {
    return this.toolState.activeTool === 'move';
  }

  view() {
    return m('button', {
        class: this.active() ? 'button button-primary' : 'button',
        onclick: () => this.click()
      },
      m.trust(`Move ${icon}`)
    );
  }
}
