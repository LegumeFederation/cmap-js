/**
 *
 * A SceneGraphNode representing a text label for a feature on a Map.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class Label extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param config - base configuration
   */

  constructor({parent, bioMap, featureModel,config}) {
    super({parent, tags: [featureModel.name]});
    this.config = config;
    this.fm = featureModel;
    this.model = featureModel.model;
    this.view = bioMap.view;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.view.invert;
    this.stop = this.invert ? this.model.coordinates.start : this.model.coordinates.stop;
    let y1 = translateScale(this.stop, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.show = false;
    this.bounds = new Bounds({
      top: y1,
      left: this.fm.bounds.left,
      width: this.config.labelSize,
      height: -this.config.labelSize * this.model.name.length/2,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    let config = this.config;
    ctx.font = `${config.labelSize}px ${config.labelFace}`;
    let y1 = translateScale(this.stop, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let width = config.labelSize ;
    let left = this.parent.trackPos > 0 ? this.fm.bounds.right : this.fm.bounds.left-width;
    this.bounds = new Bounds({
        top: y1,
        left: left,
        width: width,
        height: -ctx.measureText(this.model.name).width,
        allowSubpixel: false
    });
    if(!this.show) return;
    let gb = this.globalBounds || {};
    ctx.save();
    ctx.translate(gb.left, gb.top);
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.model.name, 0, config.labelSize-2);
    ctx.restore();
    // reset bounding box to fit the new stroke location/width
     }
}
