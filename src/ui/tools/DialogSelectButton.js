/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class DialogSelectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: 'hidden'};
  }

  onClick() {
    let visible = this.props.visible === this.props.dialog ? 'hidden' : this.props.dialog;
    this.props.set(visible);
  }

  render({icon, text}) {
    // store these bounds, for checking in drawLazily()

    return (
      <GestureWrapper
        onTap={() => this.onClick()} //doubles as onClick
      >
        <div class={'three columns button'}>
          <div>
            <i class={'material-icons'}> {icon} </i>
            <span> {text} </span>
          </div>
        </div>
      </GestureWrapper>
    );
  }
}

