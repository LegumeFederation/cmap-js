/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component,} from 'preact';
import AddMapDialog from './AddMapDialog';
import RemoveMapDialog from './RemoveMapDialog';
import ConfigureDialog from './ConfigureDialog';
import ExportDialog from './ExportDialog';

export default class MenuComponent extends Component {
  render(props, state) {
    // store these bounds, for checking in drawLazily()
    console.log('menuComp', props.menu);
    switch (props.menu) {
      case 'add':
        return <AddMapDialog toggleVis={props.set} maxHeight={props.maxHeight} appState={props.appState}/>;
      case 'remove':
        return <RemoveMapDialog toggleVis={props.set} maxHeight={props.maxHeight} appState={props.appState}/>;
      case 'configure':
        return <ConfigureDialog toggleVis={props.set} maxHeight={props.maxHeight} appState={props.appState}/>;
      case 'export':
        return <ExportDialog toggleVis={props.set} maxHeight={props.maxHeight} appState={props.appState}/>;
      case 'hidden':
      default:
        return null;
    }
  }
}

