/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';

export default class SelectionDisplayComponent extends Component {

  constructor() {
    super();
    this.state = {featureComponents: [], visible: []};
    this.featureComponents = this.featureComponents.bind(this);
    this.updateVisible = this.updateVisible.bind(this);
  }

  componentDidMount() {
    this.featureComponents(this.props.selections);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.selections.length !== nextProps.selections.length) ||
      (nextProps.selections[0].data.model !== this.props.selections[0].data.model)
    ) {
      this.featureComponents(nextProps.selections);
    }
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

  render({onClose, selections, offsetBounds}, {visible}) {
    // store these bounds, for checking in drawLazily()
    //let width = bioMap.domBounds ? bioMap.domBounds.width : 500;
    let fc = selections.map((feature, idx) => {
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

    let offsetTop = Math.floor(offsetBounds.height - selections[0].data.canvasBounds.top);

    return (
      <div class={'biomap-info'} style={{position: 'relative', left: selections[0].maxX, top: -offsetTop}}>
        <div style={{display: 'inline-block', width: '84%'}}/>
        <i
          class={'material-icons'}
          style={{
            display: 'inline-block',
            textAlign: 'right',
            marginRight: '1rem',
            marginLeft: 'auto',
            marginTop: '1rem'
          }}
          onClick={onClose}
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

