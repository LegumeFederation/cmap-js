/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h,Component} from 'preact';
import {Bounds} from '../../../model/Bounds';
import GestureWrapper from '../../Gesture';

export default class BioMapComponent  extends Component {

  constructor() {
    super();
    //this.setState({dirty:false});
    this.setState({width:10});
    //bind eventHandlers to this
    this.handleWheel = this.handleWheel.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount (){
    let cvs = this.base.children[1];
    let mapBounds = new Bounds(cvs.getBoundingClientRect());
    this.props.bioMap.setCanvas(cvs);
    this.props.bioMap._layout(mapBounds);
    this.props.bioMap.draw();
    this.setState({width: this.props.bioMap.bounds.width});
    this.setState({bounds: mapBounds});
    this.setState({dirty:true});
  }

  updateCanvas(){
    // this.props.bioMap.setDomBounds(this.state.bounds);
    // this.props.bioMap.setCanvas(this.base.children[1]);
    this.props.bioMap.draw();
    this.setState({dirty:false});
  }

  componentWillUpdate(nextProps, nextState){
    console.log('will update', this.props.bioMap === nextProps.bioMap, this.props.bioMap, nextProps.bioMap);
    if(this.state.width != nextState.width){
      this.updateCanvas();
      console.log('redrawin!',this.state.dirty,this.props.bioMap.dirty);
    }
  }

  componentDidUpdate() {
    let cvs = this.base.children[1];
    let mapBounds = new Bounds(cvs.getBoundingClientRect());
    this.props.bioMap.setCanvas(cvs);
    this.props.bioMap.setDomBounds(mapBounds);
    //this.props.bioMap.draw();
    if (this.state.dirty) this.updateCanvas();
  }

  handleWheel(evt) {
    console.log('wheelCvs', evt.deltaX, evt.deltaY);
    evt.preventDefault();
    console.log(this);
    this.props.bioMap.zoomMap(evt.deltaY);
    this.setState({dirty: true});
    this.updateCanvas();
  }

  onClick(evt) {
    console.log('click', evt);
    let hits = this.props.bioMap.addCircle({x: evt.layerX, y: evt.layerY});
    this.setState({hits: hits, visible: hits.length > 0});
    this.updateCanvas();
  }

  render({bioMap, bioIndex}, {width, visible, hits}) {
    // store these bounds, for checking in drawLazily()
    if (visible) {
      let visItems = hits.map(hit => hit.data.model.name);
      window.alert(visItems);
      this.setState({visible: false});
    }
    return (
      <div style={{display:'table-cell', width:width}}>
        <div class={'swap-div'} style={{width:width}}> Testing {bioIndex} </div>
        <canvas
          id={`bioMap ${bioIndex}`}
          style={{position: 'relative'}}
          height={700}
          onWheel={this.handleWheel}
          onClick={this.onClick}
        />

      </div>
    );
  }
}

