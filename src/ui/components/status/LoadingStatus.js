/**
 * Loading
 *
 */

import {h, Component} from 'preact';

export default class LoadingStatus extends Component{
  render(){
    return (
      <div class='cvit pure-g loading-row'>
        <div class='cvit pure-u-1-12'> <p /> </div>
        <div class='cvit pure-u-5-6 loading-col'>
          <div className={'cvit loading-img'}>
            <img class='cvit loading-spinner' src='images/ajax-loader.gif' />
            <h2 class='cvit loading-element'>Loading Data</h2>
          </div>
        </div>
        <div class='cvit pure-u-1-12'> <p /> </div>
      </div>
    );
  }
}