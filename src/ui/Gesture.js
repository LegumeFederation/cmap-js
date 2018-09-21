/**
 * Hammer
 * Allow syntheticEvents to work with touch events by passing as a property.
 * <div onClick={onClick}; />
 *
 * Unlike (p)react native events, hammer uses bubbling events as opposed to
 * capture/trickle-down, so only suggest using when events won't overlap.
 */

import {h, Component, cloneElement} from 'preact';
import Hammer from 'hammerjs';


/**
 * Conversion table from react event to hammer event.
 */

const handlerToEvent = {
  action: 'tap press',
  onDoubleTap: 'doubletap',
  onPan: 'pan',
  onPanCancel: 'pancancel',
  onPanEnd: 'panend',
  onPanStart: 'panstart',
  onPinch: 'pinch',
  onPinchCancel: 'pinchcancel',
  onPinchEnd: 'pinchend',
  onPinchIn: 'pinchin',
  onPinchOut: 'pinchout',
  onPinchStart: 'pinchstart',
  onPress: 'press',
  onPressUp: 'pressup',
  onRotate: 'rotate',
  onRotateCancel: 'rotatecancel',
  onRotateEnd: 'rotateend',
  onRotateMove: 'rotatemove',
  onRotateStart: 'rotatestart',
  onSwipe: 'swipe',
  onSwipeRight: 'swiperight',
  onSwipeLeft: 'swipeleft',
  onSwipeUp: 'swipeup',
  onSwipeDown: 'swipedown',
  onTap: 'tap',
};

// Array for props that are to be used to setup hammer
let hammerProps = {
  children: true,
  direction: true,
  options: true,
  recognizeWith: true,
  vertical: true,
};

// add above events to the protected events
Object.keys(handlerToEvent).forEach(event => {
  hammerProps[event] = true;
});

function hammerSetup(hammer, props) {
  // setup directions for hammer to watch on pan and swipe
  let direction = props.direction;
  if (direction) {
    hammer.get('pan').set({direction: Hammer[direction]});
    hammer.get('swipe').set({direction: Hammer[direction]});
  }

  // can pass an options property to toggle hammer options, see hammer docs.
  if (props.options) {
    Object.keys(props.options).forEach(option => {
      if (option === 'recognizers') {
        Object.keys(props.options.recognizers).forEach(gesture => {
          let recognizer = hammer.get(gesture);
          recognizer.set(props.options.recognizers[gesture]);
          if (props.options.recognizers[gesture].requireFailure) {
            recognizer.requireFailure(
              props.options.recognizers[gesture].requireFailure
            );
          }
        });
      } else {
        let optionObj = {};
        optionObj[option] = props.options[option];
        hammer.set(optionObj);
      }
    });
  }

  // setup hammer recognize with props
  if (props.recognizeWith) {
    Object.keys(props.recognizeWith).forEach(gesture => {
      let recognizer = hammer.get(gesture);
      recognizer.recognizeWith(props.recognizeWith[gesture]);
    });
  }

  // convert prop event to hammer event and register
  Object.keys(props).forEach(prop => {
    let event = handlerToEvent[prop];
    if (event) {
      hammer.off(event);
      hammer.on(event, props[prop]);
    }
  });
}

export default class GestureWrapper extends Component{

  componentDidMount() {
    this.hammer = new Hammer(this.base);
    hammerSetup(this.hammer, this.props);
  }

  componentWillUnmount() {
    if (this.hammer) {
      this.hammer.stop();
      this.hammer.destroy();
    }
    this.hammer = null;
  }

  render(props) {
    let childProps = {};
    Object.keys(props).forEach(prop => {
      if (!hammerProps[prop]) {
        childProps[prop] = this.props[prop];
      }
    });

    //clone child passed and give it new props from the hammer stuff
    return cloneElement(props.children[0], childProps);
  }
}

