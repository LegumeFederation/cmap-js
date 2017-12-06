/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class FeatureMark extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.featureMap = bioMap;

    this.offset = this.featureMap.view.base.start*-1;
    this.lineWidth = bioMap.config.markerWeight;
    this.strokeStyle = bioMap.config.markerColor;
    this.invert = bioMap.config.invert;

    this.pixelScaleFactor = this.featureMap.view.pixelScaleFactor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: parent.bounds.width,
      height: this.lineWidth
    });
  }

  draw(ctx) {
    let y = translateScale(this.model.coordinates.start, this.featureMap.view.base, this.featureMap.view.visible,this.invert) * this.pixelScaleFactor;
    this.bounds.top = y;
    let gb = this.globalBounds || {};
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.right), Math.floor(gb.top));
    ctx.stroke();
    // reset bounding box to fit the new stroke location/width
    // lineWidth adds equal percent of passed width above and below path
    this.bounds.top = Math.floor(y - this.lineWidth/2);
    this.bounds.bottom = Math.floor( y + this.lineWidth/2);
  }
}
