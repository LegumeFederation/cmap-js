import {h, Component} from 'preact';
// TODO: Link to Add Map

export const AddMap = class AddMap extends Component {
  constructor(){
    super();
  }

  addMap(uiStore,direction){
    uiStore.addMap(direction);
  }

  render(props, state) {
    const {uiStore, direction} = this.props;
    let modal = 'map-left';
    if(direction) modal = 'map-right';
    return(
      <button className={'cmap pure-button add-map-button'} onClick={() => uiStore.displayModal(modal)} > Add Map </button>
    );
  }
};
