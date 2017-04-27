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
    const b = this.parent.bounds;
    const backboneWidth = b.width * 0.25;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.height * 0.025,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: b.height * 0.95
    });
		console.log(this.bounds.width);

		this.backbone = new MapBackbone({ parent: this});	
		this.addChild(this.backbone);

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
        minY: fm.globalBounds.top,
        maxY: fm.globalBounds.bottom,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data:fm
      });
      return fm;
    });

    markerGroup.locMap.load(fmData);
    this.locMap.load(this.visible);
  }
}
