import {h, Component} from 'preact';
import {observer} from 'mobx-react';

export const Modal = observer(class Modal extends Component {
  closeModal= (e )=>{
    e.stopPropagation();
    e.preventDefault();
    this.props.uiStore.displayModal('');
  }
  render(props,state){
    const {uiStore} = this.props;

    return (
      <div className={'modal'} onClick={(e)=> this.closeModal(e)}>
        <div className={'modal-content'} onClick={(e)=>{ e.stopPropagation(); /* prevent close when click in modal*/}}>
          <span className={'close'} onClick={(e)=> this.closeModal(e)}>&times;</span>
          {this.props.children}
        </div>
      </div>
    );
  }
});