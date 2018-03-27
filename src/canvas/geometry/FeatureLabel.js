/**
 *
 * A SceneGraphNode representing a text label for a feature on a Map.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class FeatureLabel extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   */

  constructor({parent, bioMap, featureModel,config}) {
    super({parent, tags: [featureModel.name]});
    this.config = config;
    this.model = featureModel;
    this.view = bioMap.view;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.view.invert;
    this.start = this.model.coordinates.start;
    this.bounds = new Bounds({
      top: 0,
      left: 5,
      width: 200, //this.fontSize*(this.model.name.length),
      height: 12,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    let config = this.config;
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.bounds.top = y;
    this.bounds.bottom = y + config.labelSize;
    let gb = this.globalBounds || {};
    ctx.font = `${config.labelSize}px ${config.labelFace}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.fillText(this.model.name, gb.left, gb.top);
    // reset bounding box to fit the new stroke location/width
    this.bounds.width = this.bounds.left + Math.floor(ctx.measureText(this.model.name).width) + 1;
    if (this.parent.bounds.width < this.bounds.width) this.parent.bounds.width = this.bounds.width;
  }
}
