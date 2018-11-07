/**
 * HorizontalLayout (left to right)
 * A mithril component for horizontal layout of BioMaps.
 */

import {h} from 'preact';
import LayoutBase from './LayoutBase';
import BioMapComponent from './components/BioMapComponent';
import ModalSelector from './components/ModalSelector';
import {Bounds} from '../../model/Bounds';

export default class HorizontalLayout extends LayoutBase {
  constructor(){
    super();
    this.state = {
      bioMapComponents: [],
      bioMaps: [],
      menuVis: 'hidden',
      menuTarget: null
    };
    this.modalToggle = this.modalToggle.bind(this);
  }

  componentWillMount(){
    this._layoutBioMaps(this.props.appState);
    //this.setState({bioMapComponents: bioMapComponents, bioMaps: this.props.appState.bioMaps.length});
  }

  componentDidMount() {
    console.log('hl cdm', this.base.offsetHeight, this.props.maxHeight);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.appState.bioMaps.length !== this.state.bioMaps) this._layoutBioMaps();
  }

  componentWillUpdate() {
    console.log('hl cdu', this.base.offsetHeight, this.props.maxHeight);
  }

  modalToggle(newMenu, menuTarget) {
    console.log('hl mt', newMenu, menuTarget);
    this.setState({menuVis: newMenu, menuTarget: menuTarget});
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
      return <BioMapComponent
        bioMap={model}
        appState={appState}
        bioIndex={mapIndex}
        minWidth={minWidth}
        style={'display:table-cell; width:400px;'}
        modalToggle={this.modalToggle}
        modalData={this.state.menuTarget}
      />;
    });
    this.setState({bioMapComponents: bioMapComponents, bioMaps: this.props.appState.bioMaps.length});
    // Add map controls
  }

  render(props, state) {
    //let bmc = null;
    //if (props.appState.bioMaps.length !== this.state.bioMaps) bmc = this._layoutBioMaps();
    return (
      <div
        class='twelve columns'
        style={{maxHeight: props.maxHeight || '100%', overflow: 'auto'}}
        id={'horizontal-layout-container'}
      >
        {state.menuVis !== 'hidden' ?
          <ModalSelector
            menuType={state.menuVis}
            modalToggle={this.modalToggle}
            modalData={state.menuTarget}
            modalHeight={props.maxHeight}
          />
          :
          state.bioMapComponents
        }
      </div>
    );
  }

}
