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
      offset: 0
    };
    //bind eventHandlers to this
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.setDivOffset();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.leftBound !== nextProps.leftBound) {
      this.setDivOffset();
    }
  }

  setDivOffset() {
    const offset = this.props.leftBound - (this.base.offsetLeft - this.base.parentElement.offsetLeft);
    this.setState({offset: offset});
  }

  onClick(evt) {
    if (evt.srcEvent) evt = evt.srcEvent;
    console.log('fcc oc', 'yay!', this.state);
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

