/**
 * StatusBar
 * A mithril component of a status bar and/or footer.
 */
//import m from 'mithril';
  import {h, Component} from 'preact';

export default class StatusBar extends Component{

 //// constructor() - prefer do not use in mithril dataSourceComponents
 // /**
 //  *
 //  * @param vnode
 //  */

 // oninit(vnode) {
 //   this.appState = vnode.attrs.appState;
 // }

 // /**
 //  *
 //  * @returns {*}
 //  */

  render({attribution}) {
    return(
      <div class='cmap' id={'cmap-foot'}>
        <div class='row'>
          <div class='twelve columns cmap-attribution'>{attribution} </div>
        </div>
        <div class='row'>
          <div class='twelve columns' id='cmap-disclaimer'> cmap-js is still in alpha. As the software is still
            in development, the current state of the project may not reflect the final release.
          </div>
        </div>
      </div>
    );
  }
}
