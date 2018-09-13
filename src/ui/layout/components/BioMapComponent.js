/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h,Component} from 'preact';
import {Bounds} from '../../../model/Bounds';

export default class BioMapComponent  extends Component {
  constructor() {
    super();
    //this.setState({dirty:false});
    this.setState({width:10});
  }

  componentDidMount (){
    console.log('bio mount',this.base);
    let cvs = this.base.children[1];
    //let ctx = cvs.getContext('2d');
    //ctx.fillStyle = 'green';
    //ctx.fillRect(10, 10, 100, 100);
    this.props.bioMap.setCanvas(cvs);
    this.props.bioMap._layout(new Bounds(cvs.getBoundingClientRect()));
    console.log('lbm post lay',this.props.bioMap.bounds);
    this.props.bioMap.draw();
    console.log('lbm cdm', this.props.bioMap);
    this.setState({width: this.props.bioMap.bounds.width});
    this.setState({dirty:true});
  }

  updateCanvas(){
    this.props.bioMap.draw();
    this.setState({dirty:false});
  }

  componentWillUpdate(nextProps, nextState){
    if(this.state.width != nextState.width){
      this.updateCanvas();
      console.log('redrawin!',this.state.dirty,this.props.bioMap.dirty);
    }
  }

  componentWillReceiveProps(){

  }

  render({bioMap,bioIndex},{width}) {
    // store these bounds, for checking in drawLazily()

    return (
      <div style={{display:'table-cell', width:width}}>
        <div class={'swap-div'} style={{width:width}}> Testing {bioIndex} </div>
        <canvas id={`bioMap ${bioIndex}`} height={700} />
      </div>
    );
  }
}

