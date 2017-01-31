import Inferno from 'inferno/dist/inferno.js';
import Component from 'inferno-component';
import icon from '../svg-icons/zoom-in.svg';

export class Zoom extends Component {

  render() {
    return (
      <button dangerouslySetInnerHTML={ { __html: `Zoom ${icon}` } }>
      </button>
    )
  }
}
