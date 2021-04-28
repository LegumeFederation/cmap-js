import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {Modal} from './Modal';

export const AddMapModal = observer(class AddMapModal extends Component {
  state = {
    selectedMap:''
  }

  handleChange=(e) => {
    this.setState({selectedMap: e.target.value});
  }

  addMap=(e) =>{
    e.preventDefault();
    if(this.state.selectedMap) {
      this.props.uiStore.addMap(this.state.selectedMap, this.props.direction);
    }
    this.setState({selectedMap: ''});
  }

  render(){
    const {uiStore, direction} = this.props;
    const dataStore = uiStore.dataStore;
    let options = [];
    let sKeys = Object.keys(dataStore.sources);
    sKeys.forEach(sKey => {
      let mKeys = Object.keys(dataStore.sources[sKey].maps);
      let mOptions = [];
      mKeys.forEach( mKey => {
        if(uiStore.mapOrder.indexOf(mKey) === -1){
          mOptions.push(
            <label for={`checkbox-radio-option-${mKey}`} className={'cvit pure-radio'}>
              <input type={'radio'} id={`checkbox-radio-option-${mKey}`} name={'selectedMap'} value={mKey} onChange={this.handleChange} /> {dataStore.sources[sKey].maps[mKey].name}
            </label>
          );
        }
      });
      options.push(
        <form className={'cvit pure-form pure-form-stacked'}>
          <fieldset>
            <legend>{sKey}</legend>
            {mOptions}
          </fieldset>
        </form>

      );
    });

    return (
      <Modal uiStore={uiStore}>
        <div className={'cvit modal-specific-content'}>
          <header className={'cvit modal-content-header'}>
            <h1 >Add Maps</h1>
            <hr />
            <p> Add map to {direction ? 'right' : 'left'} of  displayed map set.</p>
          </header>
          <div className={'cvit modal-content-body'}>
            {options}
          </div>
        </div>
        <div className={'cvit modal-controls pure-g'}>
          <span className={'cvit pure-u-1-4'} />
          <button className={'cvit pure-u-1-4 pure-button pure-button-primary'} onClick={this.addMap}> Add Map </button>
          <button className={'cvit pure-u-1-4 pure-button pure-button-active'} onClick={()=> uiStore.displayModal('')} > Close </button>
          <span className={'cvit pure-u-1-4'} />
        </div>
      </Modal>
    );
  }
});