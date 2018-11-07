/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';

export default class FeatureControlComponent extends Component {

  constructor() {
    super();
    this.state = {
      width: 10,
      offset: 0,
      refreshPosition: false
    };
    //bind eventHandlers to this
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.setDivOffset();
  }

  componentDidUpdate() {
    if (this.state.refreshPosition) {
      this.setDivOffset();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.leftBound !== nextProps.leftBound) {
      this.setState({refreshPosition: true, offset: 0});
    }
    if (this.props.bioIndex !== nextProps.bioIndex) {
      this.setState({refreshPosition: true, offset: 0});
    }
  }

  setDivOffset() {
    let offset = this.props.leftBound - (this.base.offsetLeft - this.base.parentElement.offsetLeft);
    this.setState({offset: offset, refreshPosition: false});
  }

  onClick() {
    console.log('fcc oc', this.props);
    this.props.modalToggle('feature', this.props.modalData);
  }

  render({featureTrack}, {offset}) {
    // store these bounds, for checking in drawLazily()
    return (
      <div
        class={'feature-title'}
        style={
          {
            position: 'relative',
            left: offset,
            width: featureTrack.bounds.width
          }
        }
        onClick={this.onClick}
      >
        {featureTrack.title}
      </div>
    );
  }
}

