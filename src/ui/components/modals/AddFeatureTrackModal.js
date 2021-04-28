import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {Modal} from './Modal';
import ColorPicker from '../ColorPicker';

export const AddFeatureTrackModal = observer(class AddFeatureTrackModal extends Component {
  state = {
    title:`Track ${Object.keys(this.props.uiStore.activeMaps[this.props.bioMapKey].tracks).length+1}`,
    filters: [],
    colors:[],
  }

  handleChange=(e) => {
    this.setState({selectedMap: e.target.value});
  }

  addTrack=(e) =>{
    e.preventDefault();
    const {uiStore, bioMapKey, direction} = this.props;
    const{filters,colors,title} = this.state;
    const bioMap = uiStore.activeMaps[bioMapKey];
    if(filters.length){
      bioMap.addTrack(direction,title,filters,colors);
    }
    bioMap.setModal('');
  }

  onTitleChange =(e)=> {
    this.setState({title: e.srcElement.value});
  }

  addFeature = (e,bioMap)=>{
    e.preventDefault();
    const filters = this.state.filters.concat([bioMap.bioMap.tags[0]]);
    const colors = this.state.colors.concat(['#FF0000']);
    this.setState({filters: filters, colors: colors});
  }

  onSelected = (e,idx) =>{
    let filters = this.state.filters;
    filters[idx] = e.originalTarget.selectedOptions[0].value;
    this.setState({filters:filters});
  }

  onColorUpdate = (idx,color)=>{
    let colors = this.state.colors.slice(0);
    colors[idx] = color;
    this.setState({colors:colors});
  }

  removeFeature = (idx) =>{
    let filters = this.state.filters.slice(0);
    filters.splice(idx,1);
    let colors = this.state.colors.slice(0);
    colors.splice(idx,1);
    this.setState({filters:filters, colors:colors});
  }

  render(){
    const {uiStore, bioMapKey, direction} = this.props;
    const {title, filters, colors} = this.state;
    const bioMap = uiStore.activeMaps[bioMapKey];
    let options = [];
    filters.forEach((filter,idx) => {
      const color = colors[idx] || '#FF0000';
      options.push(
        <div className={'cvit pure-control-group'}>
          <label for={`filter-options-${idx}`}>Feature</label>
          <select id={`filter-options-${idx}`} onChange={(e)=> this.onSelected(e,idx)}>
            {bioMap.bioMap.tags.map( tag => {
           return( <option value={tag} selected={tag === filter} > {tag} </option>);
          })}
          </select>
          <ColorPicker baseColor={color} index={idx} removeFeature={(idx)=>this.removeFeature(idx)} onColorUpdate={(idx,color)=> this.onColorUpdate(idx,color)} />
        </div>
      );
    });

    return (
      <Modal uiStore={uiStore}>
        <div className={'cvit modal-specific-content'}>
          <header className={'cvit modal-content-header'}>
            <h1 >Add Track</h1>
            <hr />
            <p> Add track to {direction ? 'right' : 'left'} of  displayed map backbone.</p>
          </header>
          <div className={'cvit modal-content-body'}>
            <form className={'cvit pure-form pure-form-aligned'}>
              <fieldset>
                <legend> Configure new track</legend>
                <div className={'cvit pure-control-group'}>
                  <label for={'title-input'}> {'Track Title'} </label>
                  <input
                    id={'title-input'}
                    type={'text'}
                    placeholder={'track name'}
                    onInput={(e) => this.onTitleChange(e)}
                    value={title}
                  />
                </div>
                {options}
                <div class='pure-controls'>
                  <button className={'cvit pure-button'} onClick={(e)=>this.addFeature(e,bioMap)}> Add Feature </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
        <div className={'cvit modal-controls pure-g'}>
          <span className={'cvit pure-u-1-4'} />
          <button className={'cvit pure-u-1-4 pure-button pure-button-primary'} onClick={(e)=>this.addTrack(e)}> Add Track </button>
          <button className={'cvit pure-u-1-4 pure-button pure-button-active'} onClick={() => bioMap.setModal('')} > Close </button>
          <span className={'cvit pure-u-1-4'} />
        </div>
      </Modal>
    );
  }
});