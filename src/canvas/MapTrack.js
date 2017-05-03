/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import {SceneGraphNodeTrack} from './SceneGraphNodeTrack';
import { Group } from './SceneGraphNodeGroup';
import {Bounds} from '../model/Bounds';
import {FeatureMark} from './FeatureMark';
import {MapBackbone} from './MapBackbone';

export class  MapTrack extends SceneGraphNodeTrack {

  constructor(params) {
    super(params);
    console.log('mapTrack',this.parent);
    const b = this.parent.bounds;
    const backboneWidth = b.width * 0.25;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.height * 0.025,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: b.height * 0.95
    });
    this.mC = this.parent.mapCoordinates;
		this.backbone = new MapBackbone({ parent: this});	
		this.addChild(this.backbone);
   // this.locMap.insert({
   //   minX: this.bounds.left,
   //   maxX: this.bounds.right,
   //   minY: this.parent.mapCoordinates.start,
   //   maxY: this.parent.mapCoordinates.stop,
   //   data: this.backbone
   // });

		let markerGroup = new Group({parent:this});
    this.addChild(markerGroup);

    this.markerGroup = markerGroup;
    markerGroup.bounds = this.backbone.bounds;

    let filteredFeatures = this.parent.model.features.filter( model => {
      return model.length <= 0.00001;
    });
    let fmData = [];
		console.log('features');
		console.log(filteredFeatures);
    this.featureMarks = filteredFeatures.map( model => {
      let fm = new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: this.parent.model
      });
      markerGroup.addChild(fm);
      fmData.push({
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data:fm
      });
      return fm;
    });

    markerGroup.locMap.load(fmData);
    this.locMap.load(fmData);
  }

  get visible(){
    let vis = [{
      minX: this.bounds.left,
      maxX: this.bounds.right,
      minY: this.parent.mapCoordinates.start,
      maxY: this.parent.mapCoordinates.stop,
      data: this.backbone
    }];

    vis = vis.concat(this.locMap.search({
      minX: this.bounds.left,
      maxX: this.bounds.right,
      minY: this.mC.visible.start,
      maxY: this.mC.visible.stop
    }));
    return vis;
  }
}
