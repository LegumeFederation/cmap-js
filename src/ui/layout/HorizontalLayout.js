/**
 * HorizontalLayout (left to right)
 * A mithril component for horizontal layout of BioMaps.
 */

import {h} from 'preact';
import LayoutBase from './LayoutBase';
import BioMapComponent from './components/BioMapComponent';
import {Bounds} from '../../model/Bounds';
import BioMap from '../../canvas/canvas/BioMap';

function _onDataLoaded(item){
  return {bioMapComponents: _layoutBioMaps(),
          test:item};
}

function _layoutBioMaps(){
  return 'The son of Jor-El shall kneel before Zod!';
}
export default class HorizontalLayout extends LayoutBase {
  constructor(){
    super();
    this.setState({bioMapComponents : []});
  }

  componentWillMount(){
    console.log('hl wrp wm',this.props);
    this._layoutBioMaps();
  }

  componentWillReceiveProps(nextProps,nextState){
      console.log('hl wrp',this.props,nextProps);
      if(this.base) this._layoutBioMaps();
  }

  _layoutBioMaps(){
    let activeMaps = this.props.appState.bioMaps;
    let bounds = this.props.bounds;
    let n = activeMaps.length;
    let padding = Math.floor(bounds.width * 0.1 / n);
    padding = 0; // TODO: decide whether to add padding between the biomaps
    let childHeight = Math.floor(bounds.height);
    let cursor = Math.floor(padding * 0.5);
    let bmbounds = new Bounds(this.props.bounds);

    let bioMapComponents = activeMaps.map((model, mapIndex) => {
      let BM = new BioMap({
        bioMapModel:model,
        appState:this.props.appState,
        layoutBounds: bmbounds,
        bioMapIndex : mapIndex,
        initialView: this.props.appState.allMaps[0].config
      });
      return <BioMapComponent bioMap={BM} bioIndex={mapIndex} class={'test-canvas'} style={'display:table-cell; width:400px;'} />;
    });

    this.setState({bioMapComponents: bioMapComponents});
  }

  render(props, state) {
    console.log('meep',this.state,this.props);
    return ( <div class='twelve columns' id={'horizontal-layout-container'}> {this.state.bioMapComponents} </div> );
  }

}
