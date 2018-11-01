/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h,Component} from 'preact';
import {Bounds} from '../../../model/Bounds';
import GestureWrapper from '../../Gesture';
import BioMap from '../../../canvas/canvas/BioMap';

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
    cvs.width = BM.domBounds.width;// this.bioMap.domBounds.width;
    let cvsWidth = this.props.minWidth > cvs.width ? this.props.minWidth : cvs.width;
    this.setState({layout: BM, width: cvsWidth, dirty: true});
  }

  componentDidMount() {
    this.layoutBioMap(this.base.children[1], this.props.bioMap);
    this.updateCanvas();
    this.setState({dirty:false});
  }

  updateCanvas() {
    let cvs = this.base.children[1];
    let bioMap = this.state.layout;
    bioMap.setCanvas(cvs);
    bioMap.draw();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.dirty) {
      this.updateCanvas();
      this.setState({dirty: true});
    }
    if (nextProps.bioMap !== this.state.layout.model) {
      this.layoutBioMap(this.base.children[1], nextProps.bioMap);
    }
  }

  componentDidUpdate() {
    if (this.state.dirty) {
      this.updateCanvas();
      this.setState({dirty: false}); //usually bad idea to set state in did update, but best way to make sure that canvas gets updated
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

  render({bioMap, bioIndex, minWidth}, {visible, hits, width}) {
    // store these bounds, for checking in drawLazily()
    //let width = bioMap.domBounds ? bioMap.domBounds.width : 500;
    let eleWidth = minWidth > width ? minWidth : width;
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
      <div style={{display: 'table-cell', width: eleWidth}}>
        <div class={'swap-div'} style={{width: eleWidth}}> {bioMap.name} <br/> {bioMap.source.id} </div>
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

