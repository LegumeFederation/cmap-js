import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {Modal} from './Modal';

export const ExportModal = observer(class ExportModal extends Component {
  render(){
    const {uiStore} = this.props;
    return (
      <Modal uiStore={uiStore}>
        <div >
          <h1 > Export</h1>
          <hr />
          <p> To be implemented once UX bugs are worked out. </p>
        </div>
      </Modal>
    );
  }
});