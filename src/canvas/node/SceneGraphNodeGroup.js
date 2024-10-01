/**
 * FeatureMarker
 * A SceneGraphNode representing a feature on a Map with a line or hash mark.
 */
import {SceneGraphNodeBase} from './SceneGraphNodeBase.js';

export class SceneGraphNodeGroup extends SceneGraphNodeBase {

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
}
