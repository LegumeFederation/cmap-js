/**
 *
 * A SceneGraphNode representing a circular mark.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class Dot extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param config - configuration information object
   */

  constructor({parent, bioMap, featureModel, config}) {
    super({parent, tags: [featureModel.name]});
    //setup config
    this.config = config;
    this.model = featureModel;
    this.view = bioMap.view;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.view.invert;
    this.start = this.model.coordinates.start;
    this.radius = config.width;
    this.depth = 0;

    // setup initial placement
    if (this.model.coordinates.depth) {
      this.depth = translateScale(this.model.coordinates.depth, {
        start: 0,
        stop: config.displayWidth
      }, config.view, false);
    }
    this.bounds = new Bounds({
      top: 0,
      left: 0,
      width: 2 * this.radius, //this.fontSize*(this.model.name.length),
      height: 2 * this.radius,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    //Setup a base offset based on parent track
    if (this.start < this.view.visible.start || this.start > this.view.visible.stop) return;
    if (!this.offset) {
      const left = this.globalBounds.left;
      const top = this.globalBounds.top;
      this.offset = {top: top, left: left};
    }
    let config = this.config;
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let x = this.depth;

    // Draw dot
    ctx.beginPath();
    ctx.fillStyle = config.fillColor;
    ctx.arc(x + this.offset.left, y + this.offset.top, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = config.lineWeight;
    ctx.strokeStyle = config.lineColor;
    ctx.stroke();

    //update bounding box
    this.bounds.translate(x-this.radius-this.bounds.left, y-this.radius-this.bounds.top);
  }
}