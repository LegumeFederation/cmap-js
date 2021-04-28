import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {Modal} from './Modal';

export const ConfigureDefaultModal = observer(class ConfigureDefaultModal extends Component {
  render(){
    const {uiStore} = this.props;
    return (
      <Modal uiStore={uiStore}>
        <div>
          <h1> Configure Defaults</h1>
          <hr />
          <p> All the config, all of it.</p>
        </div>
      </Modal>
    );
  }
});