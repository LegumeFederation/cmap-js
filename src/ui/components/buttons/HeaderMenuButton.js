import {h, Component} from 'preact';
import {observer} from 'mobx-react';
//import {JSXTemplateTest } from './TemplateTest';

export const HeaderMenuButton = class HeaderMenuButton extends Component {
  constructor(){
    super();
  }

  render(props, state) {
    const {uiStore} = this.props;
    return (
      <div className={'pure-u-1-12'}>
        <div id={'menuLink'} className={'menu-link'} onClick={() => uiStore.toggleHeaderMenu()}>
          <span />
        </div>
      </div>
    );
  }
};