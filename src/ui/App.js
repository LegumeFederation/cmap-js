/**
 * App
 * The top-level preact component for the CMAPjs application interface
 */
import {h, Component} from 'preact';
import {observer} from 'mobx-react';

import {Header} from './Header';
import {CMAP} from './CMAP';
import LoadingStatus from './components/status/LoadingStatus';

export const App = observer(class App extends Component {

  render(props,state){
    const {uiStore} = this.props;
    return (
      <div id={'cmap-app'}>
        <h1 onClick={()=> uiStore.setMainWindowStatus('default')}>{'Hello World'}</h1>
        <Header uiStore={uiStore} />
        {uiStore.mainWindowStatus === 'default' ?
          <CMAP uiStore={uiStore} />
          :
          uiStore.mainWindowStatus === 'loading' ?
            <LoadingStatus />
            :
            null
        }
      </div>
    );
  }
 });