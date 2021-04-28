import {h, Component} from 'preact';
import {observer} from 'mobx-react';

export const HeaderMenu = observer( class HeaderMenu extends Component {
  constructor(){
    super();
  }

  render(props, state) {
    const {uiStore} = this.props;
    const isActive = uiStore.headerMenuVisible;

    return(
      <div id='layout' className={`pure-u-1-8 ${isActive ? 'active' : ''}`}>
        <div id='menu' className={isActive ? 'active': ''}>
          <div className={'pure-menu'}>
            <ul className={'pure-menu-list'}>
              <li className={'pure-menu-item'} onClick={()=>uiStore.displayModal('configuration')} ><a href='#configuration' className={'pure-menu-link'}>Configuration</a></li>
              <li className={'pure-menu-item'} onClick={()=>uiStore.displayModal('export')}><a href='#export' className={'pure-menu-link'}>Export</a></li>
              <li className={'pure-menu-item'} onClick={()=>uiStore.displayModal('attribution')}><a href='#attribution' className={'pure-menu-link'}>Attribution</a></li>
              <li className={'pure-menu-item'} onClick={()=>uiStore.displayModal('help')}><a href={'#help'} className={'pure-menu-link'}>Help</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
