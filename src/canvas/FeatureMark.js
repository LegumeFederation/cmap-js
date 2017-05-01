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
    this.featureMap = bioMap;
    this.lineWidth = 1.0;
    let pixelScaleFactor = parent.bounds.height / bioMap.length;
    let y = this._translateScale(this.model.coordinates.start) * pixelScaleFactor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: y,
      left: 0,
      width: parent.bounds.width,
      height: this.lineWidth
    });
  }

  draw(ctx) {
    let gb = this.globalBounds || {};
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.right), Math.floor(gb.bottom - this.lineWidth));
    ctx.stroke();
  }

  _translateScale(point){
    let coord = this.featureMap.coordinates;
    let vis = this.featureMap.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
