/**
 * Header
 */
import {h, Component} from 'preact';
//import {JSXTemplateTest } from './TemplateTest';

export default class Header extends Component {
  constructor(){
    super();
  }

  render({header}) {
    return(
      <div class='row cmap' id='cmap-head'>
        <div class='twelve columns'>
          <p class='cmap-header'> cmap-js
            <span class='cmap-header'>{header}</span >
          </p>
        </div>
      </div>
    );
  }
}
