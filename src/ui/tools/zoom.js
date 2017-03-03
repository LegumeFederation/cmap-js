import m from 'mithril';
import icon from '../svg-icons/zoom-in.svg';

export class Zoom  {

  oninit(vnode) {
    this.toolState = vnode.attrs.toolState;
  }

  click() {
    if(! this.active()) {
      this.toolState.activeTool = 'zoom';
    }
    console.log(this.toolState);
//    m.redraw();
  }

  active() {
    return this.toolState.activeTool === 'zoom';
  }

  view() {
    return m('button', {
        class: this.active() ? 'button button-primary' : 'button',
        onclick: () => this.click()
      },
      m.trust(`Zoom ${icon}`)
    );
  }
}
