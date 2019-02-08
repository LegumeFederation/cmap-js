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
  render({menu, set, maxHeight, appState}) {
    // store these bounds, for checking in drawLazily()
    switch (menu) {
      case 'add':
        return <AddMapDialog toggleVis={set} maxHeight={maxHeight} appState={appState}/>;
      case 'remove':
        return <RemoveMapDialog toggleVis={set} maxHeight={maxHeight} appState={appState}/>;
      case 'configure':
        return <ConfigureDialog toggleVis={set} maxHeight={maxHeight} appState={appState}/>;
      case 'export':
        return <ExportDialog toggleVis={set} maxHeight={maxHeight} appState={appState}/>;
      case 'hidden':
      default:
        return null;
    }
  }
}

