/**
 * Alert
 *
 */

import {h, Component} from 'preact';

export default class Alert extends Component{
  constructor(){
    super();
    this.setState({visible:true});
  }

  close(){
    this.setState({visible:false});
  }

  render({message},{visible}){
    if(!visible) return null;
    return (
      <div class='container' style={{width: '100%'}}>
        <div class='row alert'>
          <div class='eleven columns'>
            {message}
          </div>
          <div class='one column'>
            <button class='close-button' onClick={() => this.close()}>X</button>
          </div>
        </div>
      </div>
    );
  }
}

