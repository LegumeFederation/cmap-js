/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class ExportComponent extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    //bind eventHandlers to this
    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    if (evt.srcEvent) evt = evt.srcEvent;
    this.props.set('export');
  }

  render({direction}, {width, visible, hits}) {
    // store these bounds, for checking in drawLazily()

    return (
      <GestureWrapper
        onTap={this.onClick} //doubles as onClick
      >
        <div class={'three columns button'}>
          <div>
            <i class={'material-icons'}> get_app </i>
            <span>Export Image</span>
          </div>
        </div>
      </GestureWrapper>
    );
  }
}

