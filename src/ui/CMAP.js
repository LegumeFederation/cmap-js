/**
 * CMAP
 */

//import preact from 'preact';
import {h, Component} from 'preact';
//import GestureWrapper from './Gesture';
//import LayoutBase from './layout/LayoutBase';
import HorizontalLayout from './layout/HorizontalLayout';
import {Bounds} from '../../oldSrc/model/Bounds';


export default class CMAP extends Component{
  constructor() {
    super();
    this.setState({viewPort:null});
  }

  componentDidMount(){
    console.log("cmap start", this.base);
    this.updateBounds();
  }

  componentWillReceiveProps(){
    this.updateBounds();
  }

  updateBounds(){
    let bnds = new Bounds(this.base.getBoundingClientRect());
    this.setState({viewPort:bnds });
  }
  dispatchGestureEvt(evt) {
    console.log(evt.type);
    if (evt.type === 'tap') {
      console.log('butts', this);
    }
  }

  render({appModel,maxHeight},{viewPort}) {
    let b2 = this.base? this.base.getBoundingClientRect() : null;
    console.log('cmap stt',maxHeight,viewPort,b2);
    return (
      <div id={'cmap-main-app'} class={'row'} style={{maxHeight:maxHeight||'100%', height: 10000, overflowY:'auto'}}  est={'moooo'} dispatchGesture={e => this.dispatchGestureEvt(e)}>
        {viewPort
        ?
          <HorizontalLayout
            appState={appModel}
            bounds={b2}
          />
        :
          null
        }
        <div class='row cmap' id='cmap-body'>
          <button onClick={() => alert('hi!')}>Click Me</button>
        </div>
      </div>
    );
  }
}

