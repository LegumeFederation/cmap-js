/**
 * CMAP
 */

import {h, Component} from 'preact';
import HorizontalLayout from './layout/HorizontalLayout';
import {Bounds} from '../model/Bounds';
import MenuComponent from './tools/MenuComponent';
import DialogSelectButton from './tools/DialogSelectButton';

export default class CMAP extends Component{
  constructor() {
    super();
    this.setState({viewPort:null});
    this.setState({menuVisible: null});
    this.setState({layoutMax: 0});
    this.setMenuComponent = this.setMenuComponent.bind(this);
  }

  componentDidMount() {
    this.updateBounds();
  }

  componentWillReceiveProps() {
    this.updateBounds();
  }

  updateBounds(){
    let bnds = new Bounds(this.base.getBoundingClientRect());
    this.setState({viewPort:bnds });
  }

  setMenuComponent(newComponent) {
    this.setState({menuVisible: newComponent});
  }

  render({appModel, maxHeight}, {viewPort, menuVisible}) {
    let b2 = this.base? this.base.getBoundingClientRect() : null;
    let layoutMax = b2 ? maxHeight - this.base.childNodes[0].offsetHeight : maxHeight;

    return (
      <div
        id={'cmap-main-app'}
        class={'row'}
        style={{maxHeight: maxHeight || '100%', height: 10000}}
      >
        <div class='row cmap' id='cmap-controls'>
          <DialogSelectButton
            text={'Add Map'}
            icon={'add_circle_outline'}
            dialog={'add'}
            visible={menuVisible}
            set={this.setMenuComponent}
          />
          <DialogSelectButton
            text={'Remove Maps'}
            icon={'remove_circle_outline'}
            dialog={'remove'}
            visible={menuVisible}
            set={this.setMenuComponent}
          />
          <DialogSelectButton
            text={'Configuration'}
            icon={'mode_edit'}
            dialog={'configure'}
            visible={menuVisible}
            set={this.setMenuComponent}
          />
          <DialogSelectButton
            text={'Export Image'}
            icon={'get_app'}
            dialog={'export'}
            visible={menuVisible}
            set={this.setMenuComponent}
          />
        </div>
        <div class={'row'}>
          <MenuComponent set={this.setMenuComponent} menu={menuVisible} appState={appModel} maxHeight={layoutMax}/>
        </div>
        {viewPort
          ?
            <HorizontalLayout
              appState={appModel}
              bounds={b2}
              maxHeight={layoutMax}
            />
          :
          null
        }
      </div>
    );
  }
}

