import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';
// TODO: Link to Add Map

export const AddTrack = observer( class AddTrack extends Component {
  constructor(){
    super();
    this.state={width:0,position:0};
  }

  componentDidMount() {
    this.setState({width:this.base.clientWidth});
  }

  componentDidUpdate(previousProps, previousState, snapshot) {
 //   let bm = this.props.uiStore.activeMaps[this.props.bioMapKey].actualBounds;
 //   if (bm && this.props.direction) {
 //     if (bm && this.props.direction) {
 //       let pos = (bm.width) - (2 * this.state.width) + 1;
 //       if (pos !== this.state.position) {
 //         this.setState({position: pos});
 //       }
 //     }
 //   }
  }

  componentWillReceiveProps = () => {
 //     let bm = this.props.uiStore.activeMaps[this.props.bioMapKey].actualBounds;
 //     if(bm && this.props.direction){
 //       let pos = (bm.width) - (2 * this.state.width) + 1;
 //       if(pos !== this.state.position) {
 //         this.setState({position: pos});
 //       }
 //     }
  };

  addTrack(bioMap,direction){
    if(direction) {
      bioMap.setModal('track:right');
    }else{
      bioMap.setModal('track:left');
    }
  }

  render() {
    const {uiStore, bioMapKey, direction} = this.props;
    const bioMap = uiStore.activeMaps[bioMapKey];
    let style ={position:'relative', zIndex:10};
    if(direction){
      style.marginLeft = bioMap.config.track.padding; //bioMap.canvasBounds.right-(2*width)+1;
    }
    return(
      <button
        className={'cmap pure-button add-map-button'} onClick={() => this.addTrack(bioMap, direction)} style={style}> + </button>
    );
  }
});
