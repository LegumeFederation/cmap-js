/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';

export default class BioMapPopover extends Component {
  constructor() {
    super();
    this.state = {featureComponents: [], visible: []};
    this.featureComponents = this.featureComponents.bind(this);
    this.updateVisible = this.updateVisible.bind(this);
  }

  componentDidMount() {
    const {uiStore, bioMapKey} = this.props;
    const bioMap = uiStore.activeMaps[bioMapKey];
    this.featureComponents(bioMap.popoverContents);
  }

  updateVisible(idx) {
    let vis = this.state.visible;
    vis[idx] = !vis[idx];
    this.setState({visible: vis});
  }

  featureComponents(selections) {
    let vis = selections.map(() => 0);
    this.setState({visible: vis});
  }

  onClose(){
    console.log('Close me!');
    this.props.uiStore.activeMaps[this.props.bioMapKey].clearPopoverContents();
  }

  render(){
    const {uiStore, bioMapKey} = this.props;
    const {visible, featureComponents} = this.state;
    const bioMap = uiStore.activeMaps[bioMapKey];

    let fc = bioMap.popoverContents.map((feature, idx) => {
      let dm = feature.data.model;
      let start = <div> start: {dm.coordinates.start} </div>;
      let stop = <div> stop: {dm.coordinates.stop} </div>;
      let tags = dm.tags.length > 0 && typeof dm.tags[0] !== 'undefined' ? <div>tags: {dm.tags.join('\n')} </div> : [];
      let aliases = dm.aliases.length > 0 && typeof dm.aliases[0] !== 'undefined' ?
        <div> aliases: {dm.aliases.join('\n')} </div> : [];

      return (
        <div>
          <div
            class={'biomap-info-name'}
            onClick={() => this.updateVisible(idx)}
          >
            {dm.name}
          </div>
          {visible[idx] ?
            <div class={'biomap-info-data'}>
              {start}
              {stop}
              {tags}
              {aliases}
            </div>
            :
            null
          }
        </div>
      );
    });
    let selections = bioMap.popoverContents;
    if(!selections.length) return null;
    console.log(bioMap.actualBounds);
    let offsetTop = Math.floor( bioMap.actualBounds.top + selections[0].data.canvasBounds.top );

    return (
      <div class={'biomap-info'} style={{left: bioMap.actualBounds.left + selections[0].minX, top: offsetTop, zIndex:100}}>
        <div style={{display: 'inline-block', width: '84%'}} />
        <i
          class={'material-icons'}
          style={{
            display: 'inline-block',
            textAlign: 'right',
            marginTop: '1rem'
          }}
          onClick={()=> this.onClose()}
        >
          close
        </i>
        <div class={'biomap-features'} style={{maxHeight: '75%', overflowY: 'auto'}}>
          {fc}
        </div>
      </div>
    );
  }
}