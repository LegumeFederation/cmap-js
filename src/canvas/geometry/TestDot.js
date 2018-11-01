/**
 *
 * A SceneGraphNode representing a circular mark.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class TestDot extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param config - configuration information object
   */

  constructor({parent, position, radius}) {
    super({parent});
    //setup config
    this.position = position;
    this.radius = radius;
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
    let y = this.position.y;
    let x = this.position.x;
    // Draw dot
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    //ctx.lineWidth = config.lineWeight;
    //ctx.strokeStyle = config.lineColor;
    //ctx.stroke();

    //update bounding box
    this.bounds.translate(x - this.radius - this.bounds.left, y - this.radius - this.bounds.top);
  }

  get visible() {
    return {data: this};
  }
}