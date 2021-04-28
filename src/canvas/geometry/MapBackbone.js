/**
 * MapBackbone
 * A SceneGraphNode representing a backbone, simply a rectangle enclosing the upper and
 * lower bounds of the map of the current feature, providing a delineated region to draw
 * features of interest
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';

export class MapBackbone extends SceneGraphNodeBase {

  /**
   * Constructor
   * @param parent - Parent scene graph node
   * @param data - Map data
   * @param config - configuration object
   */

  // eslint-disable-next-line no-unused-vars
  constructor({parent:parent, data: data, config: config}) {
    super({parent:parent});
    this.config = config;
    this.layout();
  }

  layout(){
    const backboneWidth = this.config.width || 50;
    const b = this.parent.bounds;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: this.bounds ? this.bounds.top : 0,
      left: this.bounds  ? this.bounds.left : b.width * 0.5 - backboneWidth * 0.5,
      width: this.bounds ? this.bounds.width : backboneWidth + this.config.lineWeight,
      height: b.height
    });

    //layout children
    this.children.forEach(child => child.layout());
    //update bounds if this width < parent width (widen canvas as needed)
    if(this.parent && this.canvasBounds.right > this.parent.canvasBounds.right){
      this.updateWidth({width: this.canvasBounds.right});
    }
  }

  /**
   * Draw the map backbone, then iterate through and draw its children
   * @param ctx - currently active canvas2D context
   */

  draw(ctx) {
    let config = this.config;
    let gb = this.canvasBounds || {};

    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = config.fillColor;
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );

    if(this.lineWidth > 0) {
      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = config.lineWeight;
      ctx.strokeRect(
        Math.floor(gb.left),
        Math.floor(gb.top),
        Math.floor(gb.width),
        Math.floor(gb.height)
      );
    }
    ctx.restore();
    this.children.forEach(child => child.draw(ctx));
  }
}
