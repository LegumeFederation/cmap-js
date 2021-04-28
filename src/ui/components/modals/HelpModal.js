import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {Modal} from './Modal';

export const HelpModal = observer(class HelpModal extends Component {
  render(){
    const {uiStore} = this.props;
    return (
      <Modal uiStore={uiStore}>
        <div >
          <h1 > Cmap-js</h1>
          <hr />
          <p> Find more <a href={'https://github.com/LegumeFederation/cmap-js'}>here</a></p>
        </div>
      </Modal>
    );
  }
});