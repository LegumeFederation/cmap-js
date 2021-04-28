import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {Modal} from './Modal';

export const AttributionModal = observer(class AttributionModal extends Component {
  render(){
    const {uiStore} = this.props;
    const dataStore = uiStore.dataStore;
    return (
      <Modal uiStore={uiStore}>
        <div >
          <h1 > Attribution</h1>
          <hr />
          <p> {dataStore.attribution}</p>
        </div>
      </Modal>
    );
  }
});