/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */
import {h, Component} from 'preact';

export default class ExportDialog extends Component {

  constructor() {
    super();
    this.state = {
      isOpen: true
    };
  }

  componentWillReceiveProps() {
    if (!this.state.isOpen) this.toggleOpen();
  }

  toggleOpen() {
    if (this.state.isOpen) {
      this.props.toggleVis('hidden');
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render({maxHeight}, {isOpen}) {
    // store these bounds, for checking in drawLazily()


    let configureModal = (
      <div class={'twelve columns control-dialog'} id={'cmap-map-addition-dialog'} style={{maxHeight: (maxHeight)}}>
        <h5> Configure Maps</h5>
        <p> Options to configure current view will go here. </p>
        <form class={'twelve-columns'} style={{maxHeight: maxHeight * .30, overflowY: 'auto'}}>
          <thead>
          <th> filler</th>
          </thead>
          <tbody>
          <tr> more filler</tr>
          </tbody>
        </form>
        <div class={'cmap-modal-control'}>
          <button
            class={'button'}
            onClick={() => this.toggleOpen()}
          >
            <i class={'material-icons'}> cancel </i>
            <span> Close Menu </span>
          </button>
        </div>
      </div>
    );

    return (isOpen && configureModal);
  }
}


