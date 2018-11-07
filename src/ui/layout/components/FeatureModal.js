/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */
import {h, Component} from 'preact';
import FeatureEditorComponent from './FeatureEditorComponent';

export default class FeatureModal extends Component {

  constructor() {
    super();
    this.state = {
      isOpen: true,
      filters: [],
      fillColor: [],
      title: '',
      tagList: []
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.configurationElements = this.configurationElements.bind(this);
    this.setFeature = this.setFeature.bind(this);
  }

  componentWillMount() {
    let modalData = this.props.modalData;
    let model = modalData.model || modalData.component.model;
    let tagList = model.tags ? model.tags.sort() : [];
    let featureData = modalData.config || modalData.model.config.qtl;
    let filters = featureData.filters || [tagList[0].slice];
    let fillColor = featureData.fillColor || model.config.qtl.fillColor;
    if (typeof fillColor === 'string') fillColor = [fillColor];
    this.setState({
      filters: filters.slice(),
      fillColor: fillColor.slice(),
      title: featureData.title || 'feature',
      tagList: tagList
    });
  }

  configurationElements() {
    return (
      <div
        id={'color-apply-controls'}
        style={{display: 'block'}}
      >
        {this.state.filters.map((filter, idx) => {
          let bc = this.state.fillColor[idx] || this.state.fillColor[0];
          return (
            <FeatureEditorComponent
              initialSelection={filter}
              tagList={this.state.tagList}
              baseColor={bc}
              index={idx}
              setFeature={this.setFeature}
            />
          );
        })}
      </div>
    );
  }

  setFeature(tag, color, idx) {
    let filt = this.state.filters.slice();
    let col = this.state.fillColor.slice();
    filt[idx] = tag;
    col[idx] = color;
    this.setState({
      filters: filt,
      fillColor: col
    });
  }

  filterEditor(initialSelection) {
    return (<div> {initialSelection} </div>);
  }

  toggleOpen() {
    this.props.modalToggle('hidden');
  }

  onTitleChange(evt) {
    this.setState({title: evt.srcElement.value});
  }

  render(props, state) {
    // store these bounds, for checking in drawLazily()
    let featureModal = (
      <div class={'twelve columns control-dialog'} id={'cmap-map-addition-dialog'} style={{height: props.modalHeight}}>
        <h5> Feature Editor</h5>
        <p> Options to configure the selected feature. </p>
        <div class={'twelve-columns'} style={{height: '80%', maxHeight: '80%', overflowY: 'auto'}}>
          <span class={'label-body'}> {'Track Title'} </span>
          <input
            id={'title-input'}
            type={'text'}
            placeholder={'feature'}
            onInput={this.onTitleChange}
            value={state.title}
          />
          {this.configurationElements()}
        </div>
        <div class={'cmap-modal-control'}>
          <button>
            Apply Selection
          </button>
          <button
            class={'button'}
            onClick={() => this.toggleOpen()}
          >
            <i class={'material-icons'}> cancel </i>
            <span> Close Menu </span>
          </button>
          <button
            class={'button'}
            onClick={() => this.toggleOpen()}
            style={{background: '#DA2C43', marginLeft: '2rem'}}
          >
            <i class={'material-icons'}> remove_circle_outline </i>
            <span> Remove Track </span>
          </button>
        </div>
      </div>
    );

    return (state.isOpen && featureModal);
  }
}


