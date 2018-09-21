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
    this.setState({bioMapComponents : []});
  }

  componentWillMount(){
    this._layoutBioMaps();
  }

  _layoutBioMaps(){
    let activeMaps = this.props.appState.bioMaps;
    let bmbounds = new Bounds(this.props.bounds);
    let bioMapComponents = activeMaps.map((model, mapIndex) => {
      let BM = new BioMap({
        bioMapModel:model,
        appState:this.props.appState,
        layoutBounds: bmbounds,
        bioMapIndex : mapIndex,
        initialView: this.props.appState.allMaps[0].config,
        sub: () => this.setState({})
      });
      return <BioMapComponent bioMap={BM} bioIndex={mapIndex} class={'test-canvas'} style={'display:table-cell; width:400px;'} />;
    });

    this.setState({bioMapComponents: bioMapComponents});
  }

  render(props, state) {
    return ( <div class='twelve columns' id={'horizontal-layout-container'}> {this.state.bioMapComponents} </div> );
  }

}
