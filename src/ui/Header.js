/**
 * Header
 */
import {h, Component} from 'preact';
import {HeaderMenu} from './components/HeaderMenu';
import {HeaderMenuButton} from './components/buttons/HeaderMenuButton';
import {observer} from 'mobx-react';
import {HelpModal} from './components/modals/HelpModal';
import {AttributionModal} from './components/modals/AttributionModal';
import {ExportModal} from './components/modals/ExportModal';
import {ConfigureDefaultModal} from './components/modals/ConfigureDefaultsModal';

export const Header = observer(class Header extends Component {
  constructor(){
    super();
  }

  render(props,state){
    const {uiStore} = this.props;
    let modal = null;
    switch(uiStore.modal){ //Set any active modal overlay
      case 'help':
        modal = <HelpModal uiStore={uiStore} />;
        break;
      case 'attribution':
        modal = <AttributionModal uiStore={uiStore} />;
        break;
      case 'configuration':
        modal = <ConfigureDefaultModal uiStore={uiStore} />;
        break;
      case 'export':
        modal = <ExportModal uiStore={uiStore} />;
        break;
    }
    return(
      <header>
        {modal}
        <div className={'cmap-header pure-g'}>
          <HeaderMenuButton uiStore={uiStore} />
          <div id={'app-title'} className={'pure-u-11-12 cmap-title'}>{uiStore.title}</div>
          <HeaderMenu uiStore={uiStore} />
        </div>
      </header>
    );
  }
});

