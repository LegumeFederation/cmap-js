/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component,} from 'preact';
import FeatureModal from './FeatureModal';

export default class ModalSelector extends Component {
  render(props, state) {
    // store these bounds, for checking in drawLazily()
    console.log('menuComp', props.menu);
    switch (props.menuType) {
      case 'feature':
        return <FeatureModal
          modalToggle={props.modalToggle}
          modalData={props.modalData}
          modalHeight={props.modalHeight}
        />;
      case 'hidden':
      default:
        return null;
    }
  }
}

