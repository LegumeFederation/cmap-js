import m from 'mithril';
import toolState from '../../state/ToolState';
import {Move} from './Move';
import {Zoom} from './Zoom';
import {Reset} from './Reset';
import {NewMap} from './NewMap';
import {DevMapsSlider} from './DevMapsSlider';
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
      m(this.zoom),
      // m(this.reset),
      // m(this.newMap)
      m(this.slider),
      m(this.layoutPicker),
      m(this.reset)
    ]);
  }
}
