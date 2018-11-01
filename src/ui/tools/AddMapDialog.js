/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class AddMapDialog extends Component {

  constructor() {
    super();
    this.state = {
      mapSources: [],
      selection: null,
      isOpen: true
    };
  }

  componentWillMount() {
    let newSources = this.state.mapSources;
    this.props.appState.allMaps.forEach(map => {
      if (newSources.indexOf(map.source.id) === -1) newSources.push(map.source.id);
    });
    this.setState({mapSources: newSources});
  }

  componentWillReceiveProps() {
    if (!this.state.isOpen) this.toggleOpen();
  }

  generateSelections(mapSet) {
    let maps = this.props.appState.allMaps.filter(map => {
      return (map.source.id === mapSet && this.props.appState.bioMaps.indexOf(map) === -1);
    });
    let selected = this.state.selection;
    return maps.map(map => {
      return (
        <label>
          <input
            type={'radio'}
            name={`maps4${mapSet}`}
            value={map.uniqueName}
            checked={selected === map}
            onChange={(evt) => {
              this.onSelection(evt, map);
            }}
          />
          <span class={'label-body'}> {map.name} </span>
        </label>
      );
    });
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onSelection(evt, map) {
    evt.preventDefault();
    this.setState({selection: map});
  }

  render({appState, maxHeight}, {mapSources, selection, isOpen}) {
    // store these bounds, for checking in drawLazily()

    let selectable = [];
    mapSources.forEach(source => {
      selectable.push(
        <tr>
          <td> {source}</td>
          <td>
            {this.generateSelections(source)}
          </td>
        </tr>);
    });

    let addModal = (
      <div class={'twelve columns control-dialog'} id={'cmap-map-addition-dialog'} style={{maxHeight: (maxHeight)}}>
        <h5> Add Map</h5>
        <p> Select a map from the available map sets to add to the current view. </p>
        <form class={'twelve-columns'} style={{maxHeight: maxHeight * .30, overflowY: 'auto'}}>
          <thead>
          <tr>
            <th> Data Source</th>
            <th> Available Maps</th>
          </tr>
          </thead>
          <tbody>
          {selectable}
          </tbody>
        </form>
        <div class={'cmap-modal-control'}>
          <button
            disabled={!selection}
            class={this.selection ? 'button-primary' : 'button'}
            onClick={() => {
              appState.addBioMap(selection, 0);
              this.setState({selection: null});
            }}
          >
            Add Map On Left
          </button>
          <button
            disabled={!selection}
            class={this.selection ? 'button-primary' : 'button'}
            onClick={() => {
              appState.addBioMap(selection, 1);
              this.setState({selection: null});
            }}
          >
            Add Map On Right
          </button>
          <button
            class={'button'}
            onClick={() => {
              this.toggleOpen();
            }}
          >
            Close Menu
          </button>
        </div>
      </div>
    );

    return (isOpen && addModal);
  }
}