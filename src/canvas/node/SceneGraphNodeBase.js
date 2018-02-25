/**
 * SceneGraphNodeBase
 * Base Class representing a drawable element in canvas scenegraph
 */

import rbush from 'rbush';

import {Bounds} from '../../model/Bounds';

export class SceneGraphNodeBase {

  /**
   * Create a SceneGraphNode.
   * Constructor uses ES6 destructuring of parameters from an object.
   * e.g. new SceneGraphNode({param: .., param2, etc.})
   *
   * @param {Object} params - having the following properties:
   * @param {String} tag - an label or slug
   * @param {Object} parent - the parent node
   * @param {Object} bounds - local Canvas bounds, relative to our parent.
   * This is not the same as DOM bounds of the canvas element!
   * @param {Number} rotation - degrees, default 0.
   */

  constructor({parent, bounds, rotation = 0, tags = []}) {
    this.parent = parent;
    this._rotation = rotation;
    this._tags = tags;
    this.bounds = bounds;
    this._children = []; // note: subclasses implement own children data structure
    this.locMap = rbush();
    this._visble = [];
  }

  /* getters and setters */
  /* define getters for our properties; note subclasses can override setters,
    e.g. to perform layout or calculations based on new state */

  /* getters */

  /**
   * Children scene graph nodes
   * @returns {Array|*} any child nodes this node has
   */

  get children() {
    return this._children;
  }

  /**
   * Local bounds
   * @returns {*} local bounds
   */

  get bounds() {
    return this._bounds;
  }

  /**
   *  Rotation applied on this and subsequent children
   * @returns {*} rotation
   */

  get rotation() {
    return this._rotation;
  }

  /**
   * Info tags
   * @returns {*} tags
   */

  get tags() {
    return this._tags;
  }

  /**
   * Traverse all parents bounds to calculate self Bounds on Canvas.
   * @returns {Object} - Bounds instance
   */

  get globalBounds() {
    console.assert(this.bounds, 'bounds missing');
    if (!this.parent) return this.bounds;
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

  /**
   * Use rbush to return children nodes that may be visible.
   * At this level, it is assumed that there is no viewport
   * constraints to the filter.
   *
   *  @retrun {Array} - array of rbush nodes
   */

  get visible() {
    let vis = [];
    let childVisible = this.children.map(child => {
      return child.locMap.all();
    });
    childVisible.forEach(item => {
      vis = vis.concat(item);
    });
    return vis;
  }

  /**
   *  Traverse children, returning hitmap
   *  @returns {Array} - array of rbush entries
   */

  get hitMap() {
    let hits = [];
    let childMap = this.children.map(child => {
      return child.hitMap;
    });
    childMap.forEach(item => {
      hits = hits.concat(item);
    });
    return hits;
  }

  /* setters */

  /**
   * Child scene graph nodes
   * @param {Array|*} b
   */

  set children(b) {
    this._children = b;
  }

  /**
   * Nodes local bounds
   * @param b - bounds object
   */

  set bounds(b) {
    this._bounds = b;
  }

  /**
   * Rotation
   * @param {number} degrees - rotation in degrees
   */

  set rotation(degrees) {
    this._rotation = degrees;
  }

  /**
   * Tags
   * @param {array} tags - object's descriptive tags
   */

  set tags(tags) {
    this._tags = tags;
  }

  /* public methods */

  /**
   * Translate coordinates to canvas space. When an element wants to draw on
   * canvas, it requires translating into global coordinates for the canvas.
   *
   * @param {Object} params - object with following properties:
   * @param {Number} x - x location
   * @param {Number} y - y location
   * @returns {Object} - { x, y } x,y location in global terms
   */

  translatePointToGlobal({x, y}) {
    let gb = this.globalBounds;
    return {x: x + gb.left, y: y + gb.top};
  }

  /**
   * Adds a child node to the _children array
   * and changes child node's parent to this node
   *
   * @param {object} node - SceneGraphNode derived item to insert as a child
   **/

  addChild(node) {
    if (node.parent) {
      node.parent.removeChild(node);
    }
    node.parent = this;
    if (this._children.indexOf(node) === -1) this._children.push(node);
  }

  /**
   * Removes a child node from the _children array
   * and changes child node's parent to undefined
   *
   * @param {object} node - SceneGraphNode derived node to remove
   **/

  removeChild(node) {
    //TODO: May need to use a indexOf polyfill if targeting IE < 9
    let index = this._children.indexOf(node);
    if (index > -1) {
      this._children.splice(index, 1);
    }
    node.parent = null;
  }

  /**
   * Traverse children and call their draw on the provided context
   *
   * @param {object} ctx - canvas context
   */

  draw(ctx) {
    this.children.forEach(child => child.draw(ctx));
  }
}
