/**
  * FeatureLabel
  * A SceneGraphNode representing a text label for a feature on a Map.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {Bounds} from '../model/Bounds';

export class FeatureLabel extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.featureMap = bioMap;
    this.fontSize = '12px';
    this.fontFace = 'Nunito';
    this.fontColor = 'black';
    this.pixelScaleFactor = this.featureMap.view.pixelScaleFactor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 5,
      width: parent.bounds.width,
      height: 12
    });
  }

  draw(ctx) {
    let y = this._translateScale(this.model.coordinates.start) * this.pixelScaleFactor;
    this.bounds.top = y;
    this.bounds.bottom = this.bounds.top + 12;
    let gb = this.globalBounds || {};
    ctx.font = `${this.fontSize} ${this.fontFace}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.model.name,gb.left,(gb.top + gb.height/3));
    // reset bounding box to fit the new stroke location/width
    this.bounds.right = ctx.measureText(this.model.name).width;
    if(this.parent.bounds.right < this.bounds.right) this.parent.bounds.right = this.bounds.right;
  }

  _translateScale(point){
    let coord = this.featureMap.view.base;
    let vis = this.featureMap.view.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
