/**
  * FeatureLabel
  * A SceneGraphNode representing a text label for a feature on a Map.
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';

export class FeatureLabel extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.view = bioMap.view;
    this.fontSize = bioMap.config.markerLabelSize;
    this.fontFace = bioMap.config.markerLabelFace;
    this.fontColor = bioMap.config.markerLabelColor;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 5,
      width: parent.bounds.width,
      height: 12
    });
  }

  draw(ctx) {
    let y = (this._translateScale(this.model.coordinates.start)+(this.featureMap.view.base.start*-1)) * this.pixelScaleFactor;
    this.bounds.top = y;
    this.bounds.bottom = y + this.fontSize;
    let gb = this.globalBounds || {};
    ctx.font = `${this.fontSize}px ${this.fontFace}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.model.name,gb.left, gb.top);
    // reset bounding box to fit the new stroke location/width
    this.bounds.right = this.bounds.left + Math.floor(ctx.measureText(this.model.name).width)+1;
    if(this.parent.bounds.width < this.bounds.width) this.parent.bounds.width = this.bounds.width;
  }

  _translateScale(point){
    let coord = this.view.base;
    let vis = this.view.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
