/**
 * FeatureMarker
 * A SceneGraphNode representing a feature on a Map with a line or hash mark.
 */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class SceneGraphNodeGroup extends SceneGraphNodeBase {

  /**
   * constructor
   * @param params
   */

  constructor(params) {
    super(params);
    if(params.bounds){this.bounds = params.bounds;}
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
    //let gb = this.canvasBounds || {};
    //if(!gb){ return;}
    //ctx.save();
    //ctx.globalAlpha = .5;
    //ctx.fillStyle = 'red';
    //noinspection JSSuspiciousNameCombination
    //noinspection JSSuspiciousNameCombination
    //ctx.fillRect(
    //  Math.floor(gb.left),
    //  Math.floor(gb.top),
    //  Math.floor(gb.width),
    //  Math.floor(gb.height)
    //);
    //ctx.restore();
    //this.visible.forEach(child => child.data.draw(ctx));
    this.children.forEach(child => child.draw(ctx));
  }
}