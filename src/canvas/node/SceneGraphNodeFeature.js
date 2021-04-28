/**
 * SceneGraphNodeFeature
 * A SceneGraphNode representing a non-specific feature to be drawn.
 */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class SceneGraphNodeFeature extends SceneGraphNodeBase {

  /**
   * constructor
   * @param params
   */

  constructor(params) {
    super(params);
  }



  /**
   * Return visible children elements
   * @returns {Array}
   */

  get visible() {
    let vis = [];
    let cVis = this.children.map(child => {
      return child.visible;
    });
    cVis.forEach(item => {
      vis = vis.concat(item);
    });
    return vis;
  }

  draw(ctx) {
    // for debugging use only
   // let gb = this.canvasBounds || {};
   // console.log('sgn-g', this.bounds, this.canvasBounds, this.parent.bounds);
   // ctx.save();
   // ctx.globalAlpha = .5;
   // ctx.fillStyle = 'red';
   // // noinspection JSSuspiciousNameCombination
   // // noinspection JSSuspiciousNameCombination
   // ctx.fillRect(
   //   Math.floor(gb.left),
   //   Math.floor(gb.top),
   //   Math.floor(gb.width),
   //   Math.floor(gb.height)
   // );
   // ctx.restore();
    this.children.forEach(child => child.draw(ctx));
  }
  layout() {
    //layout children
    this.children.forEach(child => child.layout());
    //update bounds if this width < parent width (widen canvas as needed)
    if(this.parent && this.canvasBounds.right > this.parent.canvasBounds.right){
      this.updateWidth({width: this.canvasBounds.right});
    }
  }
}