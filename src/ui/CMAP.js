/**
 * Header
 */
import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {AddMap} from './components/buttons/AddMap';
import {AddMapModal} from './components/modals/AddMapModal';
import {BioMapComponent} from './components/BioMapComponent';

export const CMAP = observer(class CMAP extends Component {
  constructor(){
    super();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(previousProps, previousState, snapshot){
    if(!this.props.uiStore.modal || !this.base.children[1]) {
      this.props.uiStore.updateMainWindow(this.base.children[0].children);
    } else {
      this.props.uiStore.updateMainWindow(this.base.children[1].children);
    }
  }

  // eslint-disable-next-line no-unused-vars
  render(props,state, context){
    const {uiStore} = this.props;
    let modal = null;
    let w = uiStore.mainWindow > 0 ? uiStore.mainWindow : '100%';
    if(uiStore.modal === 'map-left'){
      modal = <AddMapModal uiStore={uiStore} direction={0} />;
    } else if (uiStore.modal === 'map-right') {
      modal = <AddMapModal uiStore={uiStore} direction={1} />;
    }
    const activeMaps = uiStore.mapOrder.map( active => {
      if(Object.keys(uiStore.activeMaps).indexOf(active) !== -1) {
        return (<BioMapComponent uiStore={uiStore} bioMapKey={active} />);
      }
    });
    return(
      <div id={'cmap-content'} className={'cmap'}>
        {modal}
        <div id={'cmap-stuff'} className={'cmap'} style={{width: w}}>
          <AddMap uiStore={uiStore} direction={0} />
          <div id={'cmap-maps-active'} className={'cmap'}>
            {activeMaps}
          </div>
          <AddMap uiStore={uiStore} direction={1} />
        </div>
      </div>
    );
  }
});
