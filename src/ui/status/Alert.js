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
      <div class='container'>
        <div class='row alert'>
          <div class='eleven columns'>
            <h5>Error!</h5>{message}
          </div>
          <div class='one column'> <button class='close-button' onClick={() =>this.close()}>x</button> </div>
        </div>
      </div>
    );
  }
}

