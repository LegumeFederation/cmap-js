/**
  * Base Class representing a drawable element in canvas scenegraph.
  */
import { Bounds } from '../util/Bounds';

export class SceneGraphNodeBase {
  /**
    * Create a SceneGraphNode.
    * Constructor uses ES6 destructuring of parameters from an object.
    * e.g. new SceneGraphNode({param: .., param2, etc.})
    *
    * @param {Object} params - having the following properties:
    * @param {Object} parent - the parent node
    * @param {array} children - child nodes
    * @param {Object} bounds - local bounds, relative to our parent (Bounds)
    * @param {Object} context2d - Canvas drawing context
    * @returns {Object}
    */
  constructor({parent, children, bounds, context2d}) {
    this.parent = parent;
    this.children = children;
    this.bounds = bounds;
    this.context2d = context2d;
  }

  /**
  * Traverse all parents bounds to calculate self Bounds on Canvas.
  * @returns {Object} - Bounds instance
  */
  get globalBounds() {
    if(! this.parent) return this.bounds;
    let gb = this.parent.globalBounds;
    return new Bounds({
      top: this.bounds.top + gb.top,
      bottom: this.bounds.bottom + gb.top,
      left: this.bounds.left + gb.left,
      right: this.bounds.right + gb.left,
      width: this.bounds.width,
      height: this.bounds.height
    });
  }
}
