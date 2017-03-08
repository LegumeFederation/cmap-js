import m from 'mithril';
import toolState from '../../state/toolState';
import {Move} from './move';
import {Zoom} from './zoom';
import {Reset} from './reset';
import {NewMap} from './newMap';
import {DevMapsSlider} from './devMapsSlider';
import {LayoutPicker} from './LayoutPicker';


export class Tools  {

  constructor() {
    this.move = new Move();
    this.zoom = new Zoom();
    this.reset = new Reset();
    this.newMap = new NewMap();
    this.slider = new DevMapsSlider();
    this.layoutPicker = new LayoutPicker();

    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  view() {
    return m('div', { class: 'tools cmap-hbox' }, [
      // m(this.move),
      // m(this.zoom),
      // m(this.reset),
      // m(this.newMap)
      m(this.slider),
      m(this.layoutPicker),
      m(this.reset)
    ]);
  }
}
