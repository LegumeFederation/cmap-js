import Inferno from 'inferno/dist/inferno.js';
import Component from 'inferno-component';
import {Move} from './tools/move';
import {Zoom} from './tools/zoom';

export class Tools extends Component {
  render() {
    return (
      <span>
        <Move/>
        <Zoom/>
      </span>
    )
  }
}
