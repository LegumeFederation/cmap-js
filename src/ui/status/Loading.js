/**
 * Loading
 *
 */

import {h, Component} from 'preact';

export default class Loading extends Component{
  constructor(){
    super();
    this.setState({visible:true});
    this.setState({newit:true});
    console.log('load const', this.props);

  }

  close(){
    this.setState({visible:false});
  }

  render({status},{visible}){
    console.log('render loading');
    if(!visible) return null;

    return (
      <div class='row loading-row'>
        <div class='one column'> <p /> </div>
        <div class='ten columns loading-col'>
          <div class='loading-spinner'>
            <img class='loading-element' src='images/ajax-loader.gif' />
            <h5 class='loading-element'>{status}</h5>
          </div>
        </div>
        <div class='one column'> <p /> </div>
      </div>
    );
  }
}

