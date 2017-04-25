/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {Bounds} from '../model/Bounds';

export class FeatureMark extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.bioMap = bioMap;
    this.lineWidth = 1.0;
    let coordinatesToPixels = parent.bounds.height / bioMap.length;
    let y = this.model.coordinates.start * coordinatesToPixels;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: y,
      left: 0,
      width: parent.bounds.width,
      height: this.lineWidth
    });
  }

  draw(ctx) {
    //console.log(`FeatureMark.draw() ${this.tags} ${this.model.length}`);
    let gb = this.globalBounds || {};
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.right), Math.floor(gb.bottom - this.lineWidth));
    ctx.stroke();
  }
}
