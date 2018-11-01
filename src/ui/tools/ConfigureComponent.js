/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class ConfigureComponent extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    //bind eventHandlers to this
    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    this.props.set('configure');
  }

  render({direction}, {width, visible, hits}) {
    // store these bounds, for checking in drawLazily()

    return (
      <GestureWrapper
        onTap={this.onClick} //doubles as onClick
      >
        <div class={'three columns button'}>
          <div>
            <i class={'material-icons'}> mode_edit </i>
            <span>Configuration</span>
          </div>
        </div>
      </GestureWrapper>
    );
  }
}

