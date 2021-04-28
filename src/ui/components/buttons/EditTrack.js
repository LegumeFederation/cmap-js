import {h, Component} from 'preact';
import {observer} from 'mobx-react';
// TODO: Link to Add Map

export const EditTrack = observer( class EditTrack extends Component {
  constructor(){
    super();
    this.state={width:0,position:0};
  }

  editTrack(bioMap,trackKey){
      bioMap.setModal(`editTrack:${trackKey}`);
  }

  render() {
    const {uiStore, bioMapKey, trackKey} = this.props;
    //const {position} = this.state;
    const bioMap = uiStore.activeMaps[bioMapKey];
    const track = bioMap.tracks[trackKey];
    let style ={
      position:'relative',
      zIndex:10,
      width: track.canvasElement.canvasBounds.width,
      marginLeft:track.config.track.padding,
      overflow:'hidden',
    };
    return(
      <button
        className={'cmap pure-button add-map-button'} onClick={() => this.editTrack(bioMap, trackKey)} style={style}> {track.title}  </button>
    );
  }
});
