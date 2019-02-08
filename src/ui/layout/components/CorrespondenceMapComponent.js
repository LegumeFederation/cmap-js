/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import {Bounds} from '../../../model/Bounds';
import CorrespondenceMap from '../../../canvas/canvas/CorrespondenceMap';

export default class CorrespondenceMapComponent extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    this.state = {
      layout: null,
      dirty: false,
      refreshOffset: false,
      leftOffset: 0,
      panEvent: null,
      width: 0,
      top: 0,
      left: 0
    };
    //bind eventHandlers to this

  }

  layoutCorrespondenceMap(cvs, leftBM, rightBM) {
    let layoutBounds = new Bounds({
      top: 0,
      left: Math.floor(leftBM.offsetBounds.left + leftBM.bbGroup.bounds.right),
      right: Math.floor(rightBM.offsetBounds.left + rightBM.bbGroup.bounds.left),
      height: leftBM.domBounds.height
    });

    let CM = new CorrespondenceMap({
      bioMapComponents: [leftBM, rightBM],
      top: 0,
      layoutBounds: layoutBounds
    });

    CM.setCanvas(cvs);
    cvs.width = CM.domBounds.width;// this.bioMap.domBounds.width;
    //   let cvsWidth = this.props.minWidth > cvs.width ? this.props.minWidth : cvs.width;
    this.setState({layout: CM, width: cvs.width, dirty: true});
  }

  componentDidMount() {
    this.layoutCorrespondenceMap(this.base.children[0], this.props.leftBM, this.props.rightBM);
    this.setOffsets();
    //  this.updateCanvas();
    //this.setState({dirty:false});
  }

  setOffsets() {
    let leftB = this.props.leftBM.offsetBounds;
    let base = this.base.children[0];
    let leftOff = leftB.left + this.props.leftBM.backbone.backbone.canvasBounds.right;
    this.setState({
      top: leftB.top - base.offsetTop,
      left: leftOff - base.offsetLeft,
      refreshOffset: false,
      leftOff: base.offsetLeft
    });
  }

  updateCanvas() {
    //let cvs = this.base.children[0];
    let corrMap = this.state.layout;
    //corrMap.setCanvas(cvs);
    corrMap.draw();
    this.setState({dirty: false});
  }

  resetOffset() {
    this.setState({top: 0, left: 0, refreshOffset: true});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dirty: true});
    let lb = this.props.leftBM;
    let rb = this.props.rightBM;
    let nlb = nextProps.leftBM;
    let nrb = nextProps.rightBM;
    if (lb.model !== nlb.model || rb.model !== nrb.model || lb.backbone.backbone.canvasBounds.right !== nlb.backbone.backbone.canvasBounds.right) {
      this.layoutCorrespondenceMap(this.base.children[0], nextProps.leftBM, nextProps.rightBM);
      this.resetOffset();
    }

  }

  componentDidUpdate() {
    if (this.state.dirty) {
      this.updateCanvas();
    }
    if (this.state.refreshOffset) {
      this.setOffsets();
    } else if (this.base.children[0].offsetLeft !== (this.state.leftOff + this.state.left)) {
      this.layoutCorrespondenceMap(this.base.children[0], this.props.leftBM, this.props.rightBM);
      this.resetOffset();
    }
  }

  render({bioIndex}, {top, left}) {
    // store these bounds, for checking in drawLazily()
    //let width = bioMap.domBounds ? bioMap.domBounds.width : 500;
    return (
      <div style={{display: 'table-cell', width: 0, zIndex: -100}}>
        <canvas
          class={'cmap-canvas cmap-correspondence-map'}
          id={`corrMap ${bioIndex}`}
          style={{
            position: 'relative',
            top: top,
            left: left,
          }}
          height={700}
        />
      </div>
    );
  }
}

