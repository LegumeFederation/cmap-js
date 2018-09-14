/**
 * CMAP
 */

import {h, Component} from 'preact';
import AppModel from '../model/AppModel';
import queryString from 'query-string';
import CMAP from './CMAP';
import Header from './Header';
import StatusBar from './StatusBar';
import Alert from './status/Alert';
import Loading from './status/Loading';


export default class UI extends Component{

  constructor(){
    super();
    //grab query string
    let query = queryString.parse(location.search);
    let configURL = query.config || 'cmap.json';
    this.model = new AppModel(configURL, ()=>{this.setState({}); this.updateDimensions();} );
  }

  componentWillMount(){
    this.updateDimensions();
  }

  componentDidMount(){
    window.addEventListener('resize', () => this.updateDimensions()); //resize div max heights on window resize
    this.updateDimensions();
  }

  updateDimensions() {
    this.setState({
      windowHeight : document.querySelector('#cmap-div').offsetHeight, // Height of cmap-div to bound drawn stuff
      headerHeight : this.base ? this.base.children['cmap-head'].offsetHeight : 0, //Height of header
      footerHeight : this.base ? this.base.children['cmap-foot'].offsetHeight : 0 //Height of footer
    });
  }

  render(props, state){
    let canvasRegionMaxHeight = (state.windowHeight - state.headerHeight - state.footerHeight);
    canvasRegionMaxHeight = canvasRegionMaxHeight < 0 ? 1 : canvasRegionMaxHeight;

    return (
      <div class='cmap app-main' style={{height:state.windowHeight||0}} id='cmap-app'>
        {this.model.error
          ?
          <Alert message={this.model.status}/>
          :
          null
        }
        <Header header={this.model.header} />
        { this.model.allMaps.length > 0
          ?
            <CMAP
              appModel={this.model}
              maxHeight={canvasRegionMaxHeight}
            />
          :
            null
        }
        {this.model.busy && !this.model.error
          ?
            <Loading
              status={this.model.status}
            />
          :
            null
        }
        <StatusBar attribution={this.model.attribution} />
      </div>
    );
  }
}

