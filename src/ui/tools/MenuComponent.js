/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import AddMapDialog from './AddMapDialog';
import RemoveMapDialog from './RemoveMapDialog';
import ConfigureDialog from './ConfigureDialog';
import ExportDialog from './ExportDialog';

export default class MenuComponent extends Component {

  constructor() {
    super();
  }

  render(props, state) {
    // store these bounds, for checking in drawLazily()
    console.log('menuComp', props.menu);
    switch (props.menu) {
      case 'add':
        return <AddMapDialog maxHeight={props.maxHeight} appState={props.appState}/>;
      case 'remove':
        return <RemoveMapDialog appState={props.appState}/>;
      case 'configure':
        return <ConfigureDialog appState={props.appState}/>;
      case 'export':
        return <ExportDialog appState={props.appState}/>;
      default:
        return null;
    }
  }
}

