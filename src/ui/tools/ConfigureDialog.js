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

  render({direction}, {width, visible, hits}) {
    // store these bounds, for checking in drawLazily()

    return (
      <div class={'twelve columns'}> Configure Maps </div>
    );
  }
}

