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
    this.removeFeature = this.removeFeature.bind(this);
    this.applySelection = this.applySelection.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.removeFeature = this.removeFeature.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentWillMount() {
    let modalData = this.props.modalData;
    let model = modalData.model || modalData.component.model;
    let tagList = model.tags ? model.tags.sort() : [];
    let featureData = modalData.config || modalData.model.config.qtl;
    let filters = featureData.filters || [];
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
    if (!this.state.filters.length) return null;
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
              removeFeature={this.removeFeature}
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

  applySelection() {
    let tracks = this.props.modalData.model.tracks.slice();
    if (Math.abs(this.props.newDirection) === 1) {
      let config = JSON.parse(JSON.stringify(this.props.modalData.model.config.qtl));
      config.title = this.state.title;
      config.filters = this.state.filters.slice();
      config.fillColor = this.state.fillColor.slice();
      config.position = this.props.newDirection;
      if (this.props.newDirection === -1) {
        tracks = [config].concat(tracks);
      } else {
        tracks = tracks.concat([config]);
      }
    } else {
      tracks.some(track => {
        if (track === this.props.modalData.config) {
          track.title = this.state.title;
          track.filters = this.state.filters.slice();
          track.fillColor = this.state.fillColor.slice();
          return true;
        }
        return false;
      });
    }
    this.props.appState.editFeatureTracks(this.props.modalData.model, tracks);
    this.toggleOpen();
  }

  removeTrack() {
    if (!this.props.newDirection) {
      let tracks = this.props.modalData.model.tracks.slice();
      tracks.some((track, idx) => {
        if (track === this.props.modalData.config) {
          tracks.splice(idx, 1);
          return true;
        }
        return false;
      });
      this.props.appState.editFeatureTracks(this.props.modalData.model, tracks);
      this.toggleOpen();
    }
  }

  removeFeature(idx) {
    let features = this.state.filters.slice().splice(idx, 1);
    let colors = this.state.fillColor.slice();
    if (colors[idx]) colors.splice(idx, 1);
    this.setState({filters: features, fillColor: colors});
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
          <div class={'row'} style={{marginTop: '1rem'}}>
            <button
              class={'button'}
              onClick={() => {
                this.setFeature(state.tagList[0], state.fillColor[0], state.filters.length);
              }}
            >
              <span> Add Feature </span>
            </button>
          </div>
        </div>
        <div class={'cmap-modal-control'}>
          <button
            class={'button'}
            onClick={this.applySelection}
          >
            <i class={'material-icons'}> done </i>
            <span> Apply </span>
          </button>
          <button
            class={'button'}
            onClick={this.toggleOpen}
            style={{marginLeft: '0rem'}}
          >
            <i class={'material-icons'}> cancel </i>
            <span> Close Menu </span>
          </button>
          <button
            class={'button'}
            onClick={this.removeTrack}
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


