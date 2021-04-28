/**
 *
 * A SceneGraphNode representing a circular mark.
 *
 * @extends SceneGraphNodeBase
 */

import {Bounds} from '../../model/Bounds';
import {SceneGraphNodeFeature} from '../node/SceneGraphNodeFeature';
import {translateScale} from '../../util/CanvasUtil';

//import {translateScale} from '../../util/CanvasUtil';

export class HitDot extends SceneGraphNodeFeature {
  /**
   *
   * @param parent
   * @param position
   * @param radius
   */
  constructor({parent:parent, position = {x:0, y:0}, radius:radius}) {
    super({parent:parent});
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
    console.log(this.position);
  }
  get position(){
    return this._position;
  }

  set position(coordinates){
    this._position = {
      x: coordinates.x,
      y: this.pixelToCoordinate(coordinates.y - this.parent.namedChildren['backbone'].canvasBounds.top),
    };
  }
  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    //Setup a base offset based on parent track
    let y =  translateScale(this.position.y, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    let x = this.position.x;
    this.bounds.translate(0,y-this.bounds.top);
    let gb = this.canvasBounds || {};
    // Draw dot
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(x, gb.top, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    //update bounding box
  }

  get visible() {
    return [{data: this}];
  }

  calculateHitmap() {
    return [];
  }
}