/**
 * LayoutBase
 * A Mithril component Base class for Layouts, e.g. HorizontalLayout and
 * CircosLayout.
 */
import {h, Component} from 'preact';
import {Bounds} from '../../model/Bounds';

export default class LayoutBase extends Component {

  // constructor() - prefer do not use in mithril dataSourceComponents

  /**
   * mithril lifecycle callback
   * @param vnode
   */

  constructor() {
    super();
  }

  /**
   * mithril lifecycle method
   * @param vnode
   */

  componentDidMount() {
    // save a reference to this component's dom element
    //this.bounds = new Bounds(this.base.getBoundingClientRect());
  }

  render(props, state){
    console.log('testing lb', state);
    return ( <div> buttslol</div>);

  }
}
