import {h, Component} from 'preact';
import {observer} from 'mobx-react';
import GestureWrapper from '../Gesture';
import BioMapPopover from './BioMapPopover';
import {AddTrack} from './buttons/addTrack';
import {AddFeatureTrackModal} from './modals/AddFeatureTrackModal';
import {remToPix} from '../../util/CanvasUtil';
import {EditTrack} from './buttons/EditTrack';
import {EditFeatureTrackModal} from './modals/EditFeatureTrackModal';

//Options for the hammer-based gesture wrapper
const hammerOptions = {
  recognizers: {
    pan: {
      threshold: 0
    }
  }
};

export const BioMapComponent = observer( class BioMapComponent extends Component {
  constructor(){
    super();
  }

  componentDidMount() {
    const bioMap = this.props.uiStore.activeMaps[this.props.bioMapKey];
    if(this.props.uiStore.cmapCanvasCount === 1) this.props.uiStore.setCanvasHeight();
    bioMap.setCanvas(this.base.children[2]); //set canvas in bioMapStore for linking to bounds and scenegraph
    bioMap.initScenegraph();
    if(bioMap.bounds.height === bioMap.canvas.height){
       bioMap.draw();
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(previousProps, previousState, snapshot) {
    const bioMapKey = this.props.bioMapKey;
    const bioMap = this.props.uiStore.activeMaps[bioMapKey];
    if(previousProps.bioMapKey !== bioMapKey){
      bioMap.setCanvas(this.base.children[2]); //set canvas in bioMapStore for linking to bounds and scenegraph
      bioMap.initScenegraph();
    }

    if(bioMap.canvas) {
      if (bioMap.dirty) {
        bioMap.draw();
      }
    }
  }

  onWheel(e){
    e.preventDefault();
    this.props.uiStore.activeMaps[this.props.bioMapKey].zoomMap(e.deltaY);
    this.props.uiStore.activeMaps[this.props.bioMapKey].draw();
  }

  onClick(e){
    e.preventDefault();
    this.props.uiStore.activeMaps[this.props.bioMapKey].clickHits({x:e.srcEvent.layerX, y:e.srcEvent.layerY});
  }

  onPan(e){
    e.preventDefault();
    this.props.uiStore.activeMaps[this.props.bioMapKey].onPan({
      position: {x: e.srcEvent.layerX, y: e.srcEvent.layerY},
      delta: {x: e.deltaX, y: e.deltaY},
    });
  }

  onPanStart(e){
    e.preventDefault();
    this.props.uiStore.activeMaps[this.props.bioMapKey].panStart({x:e.srcEvent.layerX, y:e.srcEvent.layerY});
  }

  onPanEnd(e){
    e.preventDefault();
    this.props.uiStore.activeMaps[this.props.bioMapKey].panEnd({x:e.srcEvent.layerX, y:e.srcEvent.layerY});
  }

  // eslint-disable-next-line no-unused-vars
  render(props, state, context) {
    const {uiStore, bioMapKey} = this.props;
    const bioMap = uiStore.activeMaps[bioMapKey];
    // generate track control buttons
    let trackHeaders = [];
    let spacerWidth =  bioMap.sceneGraph && bioMap.sceneGraph.bounds.width ?
      bioMap.sceneGraph.canvasBounds.width - (remToPix(3))
      : 0;
    let leftHeaders = [];
    let rightHeaders = [];
    if(bioMap.trackOrder.left.length > 0){
      spacerWidth -= bioMap.sceneGraph.namedChildren['lhst'].canvasBounds.width;
      //TODO: push track headers
      bioMap.trackOrder.left.forEach(track =>{
        leftHeaders.push(<EditTrack uiStore={uiStore} bioMapKey={bioMapKey} trackKey={track} />);
      });
    }
    if(bioMap.trackOrder.right.length > 0){
      spacerWidth -= bioMap.sceneGraph.namedChildren['rhst'].canvasBounds.width;
      //TODO: push track headers
      bioMap.trackOrder.right.forEach(track =>{
        rightHeaders.push(<EditTrack uiStore={uiStore} bioMapKey={bioMapKey} trackKey={track} />);
      });
    }
    // add track control buttons
    trackHeaders.push(<AddTrack uiStore={uiStore} bioMapKey={bioMapKey} direction={0} />);
    trackHeaders.push(leftHeaders);
    trackHeaders.push(<div style={{display:'inline-block',width:spacerWidth}} />);
    trackHeaders.push(rightHeaders);
    trackHeaders.push(<AddTrack uiStore={uiStore} bioMapKey={bioMapKey} direction={1} />);

    return(
      <figure className={'cmap biomap-group'} >
        { bioMap.modal === 'track:left' ?
          <AddFeatureTrackModal uiStore={uiStore} bioMapKey={bioMapKey} direction={0} />
          :
          bioMap.modal === 'track:right' ?
            <AddFeatureTrackModal uiStore={uiStore} bioMapKey={bioMapKey} direction={1} />
            :
            bioMap.modal.split(':')[0] === 'editTrack' ?
              <EditFeatureTrackModal uiStore={uiStore} bioMapKey={bioMapKey} trackKey={bioMap.modal.split(':')[1]} />
              :
              null
        }
        <figcaption className={'cmap map-header-div'} > {bioMap.bioMap.name} <br /> {bioMap.bioMap.source.id} </figcaption>
        <nav className={'cmap track-header-div'} style={{height:'2.4rem'}}> {trackHeaders}</nav>
        {bioMap.popoverContents.length > 0 ?
          <BioMapPopover  uiStore={uiStore} bioMapKey={bioMapKey} />
          :
          null}
        <GestureWrapper
          onTap={(e) => this.onClick(e)}
          onPanStart={(e) => this.onPanStart(e)}
          onPan={(e)=> this.onPan(e)}
          onPanEnd={(e)=> this.onPanEnd(e)}
          options={hammerOptions}>
          <canvas
            className={'cmap-canvas'}
            onWheel={(e)=> this.onWheel(e)}
            id={`bioMap-${bioMap.bioMap.key}`}
            style={{position: 'relative'}}
            height={uiStore.canvasHeight}
          />
        </GestureWrapper>
      </figure>
    );
  }
});