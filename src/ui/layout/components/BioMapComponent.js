/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h,Component} from 'preact';
import {Bounds} from '../../../model/Bounds';
import GestureWrapper from '../../Gesture';
import BioMap from '../../../canvas/canvas/BioMap';
import {FeatureTrack} from '../../../canvas/layout/FeatureTrack';
import FeatureControlComponent from './FeatureControlComponent';
import {remToPix} from '../../../util/CanvasUtil';

export default class BioMapComponent  extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    this.state = {
      layout: null,
      dirty: false,
      panEvent: null,
      width: 0
    };
    //bind eventHandlers to this
    this.handleWheel = this.handleWheel.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onPanStart = this.onPanStart.bind(this);
    this.onPan = this.onPan.bind(this);
    this.onPanEnd = this.onPanEnd.bind(this);
  }

  layoutBioMap(cvs, bioMap) {
    console.log('bmc lbm layout');
    cvs.width = this.props.minWidth;
    let mapBounds = new Bounds(cvs.getBoundingClientRect());
    let BM = new BioMap({
      bioMapModel: bioMap,
      appState: this.props.appState,
      layoutBounds: mapBounds,
      bioMapIndex: this.props.bioIndex,
      initialView: this.props.appState.allMaps[0].config,
      sub: () => this.setState({})
    });
    BM.setCanvas(cvs);
    let cvsWidth = this.props.minWidth > BM.domBounds.width ? this.props.minWidth : BM.domBounds.width;
    cvs.width = cvsWidth;// this.bioMap.domBounds.width;
    let featureCtrl = this.layoutFeatureButtons(BM);
    this.setState({layout: BM, width: cvsWidth, dirty: true, buttons: featureCtrl});
    BM.offsetBounds = this.genOffsetBounds();
  }

  layoutFeatureButtons(layout) {
    let buttons = [];
    console.log('bmc lfb', layout);
    buttons.push(<FeatureControlComponent
      featureTrack={{bounds: {width: '2em'}, title: '+'}}
      leftBound={remToPix(1)}
      bioIndex={this.props.bioIndex}
      modalToggle={this.props.modalToggle}
      modalData={layout}
      newDirection={-1}
    />);

    layout.children.forEach(child => {
      if (child instanceof FeatureTrack) {
        child.children.forEach(featureTrack => {
          buttons.push(<FeatureControlComponent
            featureTrack={featureTrack}
            leftBound={featureTrack.canvasBounds.left}
            bioIndex={this.props.bioIndex}
            modalToggle={this.props.modalToggle}
            modalData={featureTrack}
            newDirction={0}
          />);
        });
      }
    });

    buttons.push(<FeatureControlComponent
      featureTrack={{bounds: {width: '3rem'}, title: '+'}}
      leftBound={layout.domBounds.width - (remToPix(3))}
      bioIndex={this.props.bioIndex}
      modalToggle={this.props.modalToggle}
      modalData={layout}
      newDirection={1}
    />);
    this.setState({ditry: true});
    return buttons;
  }

  componentDidMount() {
    this.layoutBioMap(this.base.children[2], this.props.bioMap);
    this.updateCanvas();
    this.state.layout.setDomBounds(new Bounds(this.base.children[2].getBoundingClientRect()));
    //console.log('bmc cdm', this.state.buttons);
    //this.setState({dirty:false});
  }

  updateCanvas() {
    let cvs = this.base.children[2];
    let bioMap = this.state.layout;
    let ww = this.props.minWidth > bioMap.domBounds.width ? this.props.minWidth : bioMap.domBounds.width;
    cvs.width = ww;
    bioMap.setDomBounds(new Bounds(cvs.getBoundingClientRect()));
    bioMap.width = ww;
    bioMap.setCanvas(cvs);
    bioMap.draw();
    this.props.setLayout(this.state.layout, this.props.bioIndex);
    this.setState({dirty: false, width: bioMap.width});
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.dirty) {
      this.updateCanvas();
      this.setState({dirty: true});
    }
    if ((nextProps.bioMap !== this.state.layout.model) ||
      (nextProps.bioMap.tracks !== this.state.layout.model.tracks) ||
      (this.props.minWidth !== nextProps.minWidth)) {
      this.layoutBioMap(this.base.children[2], nextProps.bioMap);
    }
  }

  genOffsetBounds() {
    let cvs = this.base.children[2];
    let bnds = {
      top: cvs.offsetTop,
      bottom: cvs.offsetTop + cvs.offsetHeight,
      left: cvs.offsetLeft,
      right: cvs.offsetLeft + cvs.offsetWidth,
      width: cvs.offsetWidth,
    };
    this.setState({width: bnds.width});
    return bnds;
  }

  componentDidUpdate() {
    let oB = this.state.layout.offsetBounds;
    let cvs = this.base.children[2];
    if (cvs.offsetTop !== oB.top || cvs.offsetLeft !== oB.left || cvs.offsetWidth !== oB.width) {
      this.state.layout.offsetBounds = this.genOffsetBounds();
    }
    if (this.state.dirty) {
      this.updateCanvas();
    }
  }

  handleWheel(evt) {
    if (evt.preventDefault) evt.preventDefault();
    this.state.layout.zoomMap(evt.deltaY);
    this.updateCanvas();
    this.setState({dirty: true});
  }

  onClick(evt) {
    if (evt.srcEvent) evt = evt.srcEvent;
    let hits = this.state.layout.addCircle({x: evt.layerX, y: evt.layerY});
    this.setState({hits: hits, visible: hits.length > 0});
    this.updateCanvas();
  }

  onPan(evt) {
    if (evt.srcEvent) {
      evt = evt.srcEvent;
    }

    this.state.layout.onPan({
      position: {x: evt.layerX, y: evt.layerY},
      delta: {x: evt.movementX, y: evt.movementY},
      type: this.state.panEvent
    });
    this.updateCanvas();
  }

  onPanStart(evt) {
    if (evt.srcEvent) { //ignore hammer wrapper around normalised event
      evt = evt.srcEvent;
    }
    if (this.state.panEvent) { //Chance panStart is just an interrupted pan event
      this.state.layout.onPan({position: {x: evt.layerX, y: evt.layerY}, eventType: this.state.panEvent});
    } else {
      //Determine if pan is box select/zoom or ruler drag and update BioMap components
      let panType = this.state.layout.onPanStart({x: evt.layerX, y: evt.layerY});
      this.setState({panEvent: panType});
    }
    this.updateCanvas();
  }

  onPanEnd(evt) {
    if (evt.srcEvent) { //ignore hammer wrapper around normalised event
      evt = evt.srcEvent;
    }
    let hits = this.state.layout.onPanEnd({
      position: {x: evt.layerX, y: evt.layerY},
      delta: {x: evt.movementX, y: evt.movementY},
      type: this.state.panEvent
    });
    this.setState({panEvent: null, hits: hits, visible: hits.length > 0});
    this.updateCanvas();
  }

  render({bioMap, bioIndex, minWidth}, {visible, hits, width, buttons}) {
    // store these bounds, for checking in drawLazily()
    //let width = bioMap.domBounds ? bioMap.domBounds.width : 500;
    let eleWidth = minWidth > width ? minWidth : width;
    console.log('bmc rend', minWidth, width, eleWidth);
    if (visible) {
      let visItems = hits.map(hit => hit.data.model.name);
      window.alert(visItems);
      this.setState({visible: false});
    }
    let hOptions = {
      recognizers: {
        pan: {
          threshold: 1
        }
      }
    };

    return (
      <div style={{display: 'table-cell', width: width}}>
        <div class={'swap-div'} style={{width: width}}> {bioMap.name} <br/> {bioMap.source.id} </div>

        <div>
          {buttons}
        </div>
        <GestureWrapper
          onTap={this.onClick} //doubles as onClick
          onPanStart={this.onPanStart}
          onPan={this.onPan}
          onPanEnd={this.onPanEnd}
          options={hOptions}
        >
          <canvas
            class={'cmap-canvas'}
            id={`bioMap ${bioIndex}`}
            style={{position: 'relative'}}
            height={700}
            onWheel={this.handleWheel}
          />
        </GestureWrapper>
      </div>
    );
  }
}

