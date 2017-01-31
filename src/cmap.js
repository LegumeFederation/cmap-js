import { version } from '../package.json';
import rbush from 'rbush';
import Promise from 'bluebird/js/browser/bluebird.core.js';
import Inferno from 'inferno/dist/inferno.js';
import Component from 'inferno-component';

var P = Promise;

// console.log(rbush);
// console.log(Promise);
// console.log(Inferno);
// console.log(Component);

export class cmap {
  constructor() {
    this.version = version;
  }
}

// see if inferno works
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    }
  }
  render() {
    return (
      <div>
        <h4>This is an Infernojs component</h4>
        <span>Counter is at: { this.state.counter }</span>
      </div>
    )
  }
}

Inferno.render(<MyComponent />, document.getElementById('cmap-ui'));  
