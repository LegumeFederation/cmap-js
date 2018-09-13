/**
 * Header
 */
import {h, Component} from 'preact';
import {JSXTemplateTest } from './TemplateTest';

export default class Header extends Component {
  constructor(){
    super();
  }

  componentWillReceiveProps(nextProps,nextState){
    console.log('h wrp', nextProps);
  }

  render({header},{}) {
    console.log('rendering header');
    return(
      <div class='row cmap' id='cmap-head'>
        <div class='twelve columns'>
          <p class='cmap-header'> cmap-js
            <span class='cmap-header'>{header}</span >
          </p>
        </div>
        <JSXTemplateTest />
      </div>
    );
  }
}
