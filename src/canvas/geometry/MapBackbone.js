/**
 * MapBackbone
 * A SceneGraphNode representing a backbone, simply a rectangle enclosing the upper and
 * lower bounds of the map of the current feature, providing a delineated region to draw
 * features of interest
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase.js';
import {Bounds} from '../../model/Bounds.js';

export class MapBackbone extends SceneGraphNodeBase {

  /**
   * Constructor
   * @param parent - Parent scene graph node
   * @param bioMap - Map data
   */

  constructor({parent, bioMap,config}) {
    super({parent});
    this.config = config;
    const b = parent.bounds;
    const backboneWidth = config.width;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth + config.lineWeight,
      height: b.height
    });
    bioMap.view.backbone = this.globalBounds;
  }

  /**
   * Draw the map backbone, then iterate through and draw its children
   * @param ctx - currently active canvas2D context
   */

  draw(ctx) {
    let config = this.config;
    let gb = this.globalBounds || {};
    ctx.fillStyle = config.fillColor;
    // noinspection JSSuspiciousNameCombination
    // noinspection JSSuspiciousNameCombination
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

    this.children.forEach(child => child.draw(ctx));
  }
}
