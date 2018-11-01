/**
 * HorizontalLayout (left to right)
 * A mithril component for horizontal layout of BioMaps.
 */

import {h} from 'preact';
import LayoutBase from './LayoutBase';
import BioMapComponent from './components/BioMapComponent';
import {Bounds} from '../../model/Bounds';
import BioMap from '../../canvas/canvas/BioMap';

export default class HorizontalLayout extends LayoutBase {
  constructor(){
    super();
    this.setState({bioMapComponents: [], bioMaps: []});
  }


  componentWillMount(){
    let bioMapComponents = this._layoutBioMaps(this.props.appState);
    this.setState({bioMapComponents: bioMapComponents, bioMaps: this.props.appState.bioMaps.length});
  }

  _layoutBioMaps(appState = this.props.appState) {
    let activeMaps = appState.bioMaps;
    let bmbounds = new Bounds(this.props.bounds);
    let minWidth = bmbounds.width / activeMaps.length;
    let bioMapComponents = activeMaps.map((model, mapIndex) => {
      //let BM = new BioMap({
      //  bioMapModel:model,
      //  appState: appState,
      //  layoutBounds: bmbounds,
      //  bioMapIndex : mapIndex,
      //  initialView: appState.allMaps[0].config,
      //  sub: () => this.setState({})
      //});
      return <BioMapComponent bioMap={model} appState={appState} bioIndex={mapIndex} minWidth={minWidth}
                              class={'test-canvas'} style={'display:table-cell; width:400px;'}/>;
    });
    // Add map controls
    return bioMapComponents;
    //this.setState({bioMapComponents: bioMapComponents, bioMaps:appState.bioMaps.length});
  }

  render(props, state) {
    let bmc = null;
    if (props.appState.bioMaps.length !== this.state.bioMaps) bmc = this._layoutBioMaps();
    return (
      <div class='twelve columns'
           style={{maxHeight: props.maxHeight || '100%', overflow: 'auto'}}
           id={'horizontal-layout-container'}
      >
        {bmc ?
          bmc :
          state.bioMapComponents}
      </div>
    );
  }

}
