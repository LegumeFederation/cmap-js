/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';

export default class RemoveMapDialog extends Component {
  constructor() {
    super();
    this.state = {
      mapSources: [],
      selection: [],
      isOpen: true
    };
  }

  componentWillMount() {
    let newSources = this.state.mapSources;
    this.props.appState.bioMaps.forEach(map => {
      if (newSources.indexOf(map.uniqueName) === -1) {
        newSources.push(map.uniqueName);
      }
    });
    this.setState({mapSources: newSources});
  }

  componentWillReceiveProps() {
    if (!this.state.isOpen) this.toggleOpen();
  }

  generateSelections(mapSet) {
    return mapSet.map(map => {
      let checked = (this.state.selection.indexOf(map) !== -1);
      return (
        <label>
          <input
            type={'checkbox'}
            name={`maps4${map.uniqueName}`}
            checked={checked}
            onClick={(evt) => {
              checked = !checked;
              this.onSelection(evt, map);
            }
            }
          />
          <span class={'label-body'}> {map.uniqueName} </span>
        </label>
      );
    });
  }

  toggleOpen() {
    if (this.state.isOpen) {
      this.props.toggleVis('hidden');
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onSelection(evt, map) {
    let selection = this.state.selection.slice();
    const i = selection.indexOf(map);
    if (i === -1) {
      selection.push(map);
    }
    else {
      selection.splice(i, 1);
    }
    this.setState({selection: selection});
  }

  render({appState, maxHeight}, {selection, isOpen}) {
    // store these bounds, for checking in drawLazily()

    let selectable = (
      <tr>
        <td>
          {this.generateSelections(appState.bioMaps)}
        </td>
      </tr>
    );

    let removeModal = (
      <div class={'twelve columns control-dialog'} id={'cmap-map-removal-dialog'} style={{maxHeight: (maxHeight)}}>
        <h5> Remove Maps</h5>
        <p> Select maps from the currently displayed map sets to remove from the current view. </p>
        <form class={'twelve-columns'} style={{maxHeight: maxHeight * .3, overflowY: 'auto'}}>
          <thead>
          <tr>
            <th> Available Maps</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {selectable}
          </tbody>
        </form>
        <div class={'cmap-modal-control'}>
          <button
            disabled={selection.length === 0}
            class={selection.length === 0 ? 'button-primary' : 'button'}
            onClick={() => {
              appState.removeBioMap(selection);
              this.setState({selection: []});
            }}
          >
            <i class={'material-icons'}> remove_circle_outline </i>
            <span>Remove Maps</span>
          </button>
          <button
            class={'button'}
            onClick={() => {
              this.toggleOpen();
            }}
          >
            <i class={'material-icons'}> cancel </i>
            <span> Close Menu </span>
          </button>
        </div>
      </div>
    );

    return (isOpen && removeModal);
  }
}

