/* export a singleton object. So module which does
*
* import toolState from '.../state/toolState';
*
* will share a reference to the same instance.
*/
import {reset} from '../topics';
import {horizontalLayout} from '../layouts';
import PubSub from '../../node_modules/pubsub-js/src/pubsub';

class ToolState {

  constructor() {
    this.reset();
    // TODO: load the toolState from URL query string parameters or server session or localstorage, etc?
  }

  reset() {
    this.activeTool = null;
    this.selectedCanvas = null;
    this.zoomFactor = 0; // units of +/- vertical pixels
    this.devNumberOfMaps = 3;
    this.layout = horizontalLayout;
    PubSub.publish(reset, { evt: {}, data: null });
  }
}

export default (new ToolState());
