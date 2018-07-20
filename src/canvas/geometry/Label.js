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
    this.labelPos = config.labelPos || config.position;
    this.fm = featureModel;
    this.model = featureModel.model;
    this.view = bioMap.view;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.view.invert;
    this.stop = this.invert ? this.model.coordinates.start : this.model.coordinates.stop;
    let y1 = translateScale(this.stop, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.show = true;
    let padding = 2;
    let width = config.labelSize + padding ;
    this.offset = this.labelPos >= 0 ? 0 : padding;
    let left = this.labelPos >= 0 ? this.fm.bounds.right  : this.fm.bounds.left-width;

    this.bounds = new Bounds({
      top: y1,
      left: left,
      width: width,
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
    this.bounds.top = y1;
    this.bounds.height = -ctx.measureText(this.model.name).width;
    if(!this.show) return;
    let gb = this.globalBounds || {};
    ctx.save();
    ctx.translate(gb.right, gb.top);
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.model.name, 0, -this.offset); // config.labelSize-2);
    ctx.restore();
    // reset bounding box to fit the new stroke location/width
     }
}
