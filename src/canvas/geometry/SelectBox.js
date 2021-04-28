/**
 *
 * A SceneGraphNode representing a circular mark.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';

export class SelectBox extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param config - configuration information object
   */

  constructor({parent, position}) {
    super({parent});
    this.position = position;
    this.bounds = new Bounds({
      top: position.y,
      left: position.x,
      width: 0, //this.fontSize*(this.model.name.length),
      height: 0,
      allowSubpixel: false
    });
  }

  updatePosition(position) {
    this.bounds.right = position.x;
    this.bounds.bottom = position.y;
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */
  draw(ctx) {
    //Setup a base offset based on parent track
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = 'black';
    // noinspection JSSuspiciousNameCombination
    ctx.strokeRect(
      this.position.x,
      this.position.y,
      this.bounds.width,
      this.bounds.height
    );
  }

  get visible() {
    return {data: this};
  }

  calculateHitmap() {
    return [];
  }
}