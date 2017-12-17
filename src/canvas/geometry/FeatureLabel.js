/**
  * FeatureLabel
  * A SceneGraphNode representing a text label for a feature on a Map.
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class FeatureLabel extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.view = bioMap.view;
    this.fontSize = bioMap.config.markerLabelSize;
    this.fontFace = bioMap.config.markerLabelFace;
    this.fontColor = bioMap.config.markerLabelColor;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.config.invert;
    this.start = this.model.coordinates.start;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 5,
      width: 200, //this.fontSize*(this.model.name.length),
      height: 12
    });
  }

  draw(ctx) {
    let y = translateScale(this.start,this.view.base,this.view.visible,this.invert) * this.pixelScaleFactor;
    this.bounds.top = y;
    this.bounds.bottom = y + this.fontSize;
    let gb = this.globalBounds || {};
    ctx.font = `${this.fontSize}px ${this.fontFace}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.model.name,gb.left, gb.top);
    // reset bounding box to fit the new stroke location/width
    this.bounds.width = this.bounds.left + Math.floor(ctx.measureText(this.model.name).width)+1;
    if(this.parent.bounds.width < this.bounds.width) this.parent.bounds.width = this.bounds.width;
  }
}
