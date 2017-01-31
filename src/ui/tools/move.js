import Inferno from 'inferno/dist/inferno.js';
import Component from 'inferno-component';
import icon from '../svg-icons/move.svg';

export class Move extends Component {

  render() {
    return (
      <button dangerouslySetInnerHTML={ { __html: `Move ${icon}` } }>
      </button>
    )
  }
}
