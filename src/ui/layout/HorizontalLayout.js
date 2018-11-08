/**
 * HorizontalLayout (left to right)
 * A mithril component for horizontal layout of BioMaps.
 */

import {h} from 'preact';
import LayoutBase from './LayoutBase';
import BioMapComponent from './components/BioMapComponent';
import ModalSelector from './components/ModalSelector';
import {Bounds} from '../../model/Bounds';
import CorrespondenceMapComponent from './components/CorrespondenceMapComponent';

export default class HorizontalLayout extends LayoutBase {
  constructor(){
    super();
    this.state = {
      bioMapComponents: [],
      bioMaps: [],
      layouts: [],
      menuVis: 'hidden',
      menuTarget: null,
      corrComponents: []
    };
    this.modalToggle = this.modalToggle.bind(this);
    this.setBMLayout = this.setBMLayout.bind(this);
    this.layoutCorrespondenceMaps = this.layoutCorrespondenceMaps.bind(this);
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

  modalToggle(newMenu, menuTarget, menuNew) {
    console.log('hl mt', newMenu, menuTarget);
    this.setState({menuVis: newMenu, menuTarget: menuTarget, menuAdd: menuNew});
  }

  setBMLayout(layout, idx) {
    let layouts = this.state.layouts;
    layouts[idx] = layout;
    console.log('hl sbml', layouts);
    this.setState({layouts: layouts});
    if (layouts.indexOf(0) === -1) {
      console.log('hl sbml post', layouts);
      this.layoutCorrespondenceMaps();
    }
  }

  _layoutBioMaps(appState = this.props.appState) {
    let activeMaps = appState.bioMaps;
    let bmbounds = new Bounds(this.props.bounds);
    let minWidth = bmbounds.width / activeMaps.length;
    let lay = activeMaps.map(() => 0);
    this.setState({layouts: lay});
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
        setLayout={this.setBMLayout}
        modalToggle={this.modalToggle}
        modalData={this.state.menuTarget}
      />;
    });
    this.setState({bioMapComponents: bioMapComponents, bioMaps: this.props.appState.bioMaps.length});
    // Add map controls
  }

  layoutCorrespondenceMaps() {
    console.log('hl sbml lay', this.base.children);
    let layouts = this.state.layouts;
    let cmap = [];
    for (let i = 0; i < layouts.length - 1; i++) {
      cmap.push(
        <CorrespondenceMapComponent
          bioIndex={i}
          leftBM={layouts[i]}
          rightBM={layouts[i + 1]}
        />
      );
    }
    console.log('hl sbml cmc', cmap);
    this.setState({corrComponents: cmap});
  }

  render(props, state) {
    //let bmc = null;
    //if (props.appState.bioMaps.length !== this.state.bioMaps) bmc = this._layoutBioMaps();
    return (
      //<div class={'container'} id={'layout-container'} style={{width:'100%', maxWidth:'100%'}} >
      <div style={{position: 'relative', left: 0}}>
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
              appState={props.appState}
              newDirection={state.menuAdd}
            />
            :
            [state.bioMapComponents, state.corrComponents]
          }
        </div>
      </div>
    );
  }

}
