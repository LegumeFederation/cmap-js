/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class RemoveMapComponent extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    //bind eventHandlers to this
    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    this.props.set('remove');
  }

  render({direction}, {width, visible, hits}) {
    // store these bounds, for checking in drawLazily()

    return (
      <GestureWrapper
        onTap={this.onClick} //doubles as onClick
      >
        <div class={'three columns button'}>
          <div>
            <i class={'material-icons'}> remove_circle_outline </i>
            <span>Remove Maps</span>
          </div>
        </div>
      </GestureWrapper>
    );
  }
}

