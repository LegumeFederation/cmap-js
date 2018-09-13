/**
 * Hammer
 * Manage events for both mouse and touch native
 *
 */

//import preact from 'preact';
import {h, Component} from 'preact';
import Hammer from 'hammerjs';


/**
 * Handler for used hammer events, uncomment if you want to add support for others.
 * @type {{action: string, onPan: string, onPanCancel: string, onPanEnd: string, onPanStart: string, onPinch: string, onPinchCancel: string, onPinchEnd: string, onPinchIn: string, onPinchOut: string, onPinchStart: string, onTap: string}}
 */


export default class GestureWrapper extends Component{
  //static propTypes = {
  //  className: PropTypes.string,
  //};

  componentDidMount() {
    this.hammer = new Hammer(this.base);
    this.hammerHandler = (evt) => this.props.dispatchGesture(evt);
    let evts = this.props.gestures || 'panmove panend panstart pinchmove pinchend tap';
    let index = evts.indexOf('pinch');
    if(index !== -1){
      evts.substring(index);
      this.hammer.get('pinch').set({enable: true});
    }
    if(evts.indexOf('pan') !== -1) {
      this.hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});
    }
    this.hammerEvents = evts;
    this.hammer.on(this.hammerEvents,this.hammerHandler);
  }

  componentDidUpdate() {
    console.log('update');
    //if (this.hammer) {
    //  updateHammer(this.hammer, this.props);
    //}
  }

  componentWillUnmount() {
    if (this.hammer) {
      this.hammer.stop();
      this.hammer.destroy();
    }
    this.hammer = null;
  }

  render() {
    // Reuse the child provided
    // This makes it flexible to use whatever element is wanted (div, ul, etc)
    return h('div',{},this.props.children);
  }
}

