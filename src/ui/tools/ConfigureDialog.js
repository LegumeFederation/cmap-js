/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class ConfigureDialog extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    //bind eventHandlers to this
    this.setState({visible: false});
  }

  render({direction, setVis}, {width, visible, hits}) {
    // store these bounds, for checking in drawLazily()

    return (
      <div onClick-={setVis('hidden')} class={'twelve columns'}> Configure Maps </div>
    );
  }
}

