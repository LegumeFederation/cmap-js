/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {Bounds} from '../model/Bounds';

export class FeatureLabel extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.featureMap = bioMap;
    this.lineWidth = 1.0;
    this.pixelScaleFactor = parent.bounds.height / bioMap.length;
    let y = this._translateScale(this.model.coordinates.start) * this.pixelScaleFactor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: y,
      left: 0,
      width: parent.bounds.width,
      height: 12
    });
  }

  draw(ctx) {
    let y = this._translateScale(this.model.coordinates.start) * this.pixelScaleFactor;
    this.bounds.top = y;
    this.bounds.bottom = this.bounds.top + 12;
    let gb = this.globalBounds || {};
    ctx.font = '12px Raleway';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
    ctx.fillText(this.model.name,gb.left,(gb.top + gb.height/3));
    // reset bounding box to fit the new stroke location/width
    // lineWidth adds equal percent of passed width above and below path
    this.bounds.right = ctx.measureText(this.model.name).width;
    if(this.parent.bounds.right < this.bounds.right) this.parent.bounds.rigth = this.bounds.right;
  }

  _translateScale(point){
    let coord = this.mapCoordinates.base;
    let vis = this.mapCoordinates.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
