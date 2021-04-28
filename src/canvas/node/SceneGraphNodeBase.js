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
   * @param {Array} tags - an label or slug
   * @param {Object} parent - the parent node
   * @param {Object} bounds - local Canvas bounds, relative to our parent.
   * This is not the same as DOM bounds of the canvas element!
   * @param {Number} rotation - degrees, default 0.
   * @param {Object} base and active zoom of the view
   */

  constructor({parent: parent, bounds: bounds, rotation: rotation = 0, tags: tags = [], view: view}) {
    this.parent = parent;
    this._rotation = rotation;
    this._tags = tags;
    this.bounds = bounds;
    this._children = []; // note: subclasses implement own children data structure
    this._namedChildren ={};
    this.locMap = new rbush();
    this._visble = [];
    this.view = this.parent ? this.parent.view : view;
    this.pixelScaleFactor = this.parent ? this.parent.pixelScaleFactor : 1;
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

  get canvasBounds() {
    if (!this.parent) return this.bounds;
    let gb = this.parent.canvasBounds;
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
   *  @return {Array} - array of rbush nodes
   */

  get visible() {
    return this.children.map(child => {
      return child.visible;
    });
  }

  /**
   *  Traverse children, returning hitmap
   *  @returns {Array} - array of rbush entries
   */

  get hitMap() {
    return this.children.map(child => {
      return child.hitMap;
    });
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
    let gb = this.canvasBounds;
    return {x: x + gb.left, y: y + gb.top};
  }

  /**
   * Adds a child node to the _children array
   * and changes child node's parent to this node
   *
   * @param {object} node - SceneGraphNode derived item to insert as a child
   * @param name
   **/

  addChild(node, name='') {
    if(node.parent !== this) {
      if (node.parent) {
        node.parent.removeChild(node, name);
      }
      node.parent = this;
    }
    if (this._children.indexOf(node) === -1) this._children.push(node);
    if (name) this._namedChildren[name] = node;
  }

  /**
   * Removes a child node from the _children array
   * and changes child node's parent to undefined
   *
   * @param {object} node - SceneGraphNode derived node to remove
   * @param name
   **/

  removeChild(node,name='') {
    let index = this._children.indexOf(node);
    if (index > -1) {
      this._children.splice(index, 1);
    }
    // eslint-disable-next-line no-prototype-builtins
    if(name && this._namedChildren.hasOwnProperty(name)){
      delete this._namedChildren[name];
    }
    node.parent = null;
  }

  get namedChildren(){
    return this._namedChildren;
  }

  /**
   * Traverse children and call their draw on the provided context
   *
   * @param {object} ctx - canvas context
   */

  draw(ctx) {
    this.children.forEach(child => child.draw(ctx));
  }

  layout() {
    //layout children

    this.bounds = new Bounds({
      allowSubpixel: false,
      top: this.bounds ? this.bounds.top : 0 ,
      left: this.bounds && this.bounds.left ? this.bounds.left : 0,
      height: this.bounds ? this.bounds.height : this.parent.bounds.height,
      width: this.bounds && this.bounds.width ? this.bounds.width : this.parent.bounds.width,
    });

    this.children.forEach(child => child.layout());
    //update bounds if this width < parent width (widen canvas as needed)
    if(this.parent && this.canvasBounds.right > this.parent.canvasBounds.right){
      this.updateWidth({width: this.canvasBounds.right});
    }
  }

  updateWidth(childRight){
    this.bounds.right = this.bounds.right + (childRight - this.canvasBounds.right);
    if(this.parent && this.canvasBounds.right > this.parent.canvasBounds.right){
      this.parent.updateWidth(this.canvasBounds.right);
    }
  }

  updateView(view= undefined){
    if(view){
      this.view = view;
    } else {
      this.view = this.parent.view;
    }
    this.children.forEach(child => child.updateView());
  }

  updatePSF(pixelScaleFactor){
    this.parent.updatePSF(pixelScaleFactor);
  }

  /**
   * translate Y point to current view.
   * @param pointY
   * @returns {number}
   */
  pixelToCoordinate(pointY) {
    let coord = this.view.base;
    let visc = this.view.visible;
    let psf = this.view.pixelScaleFactor;
    return ((visc.start * (coord.stop * psf - pointY) + visc.stop * (pointY - coord.start * psf)) / (psf * (coord.stop - coord.start))) - (coord.start * -1);
  }

  calculateHitmap(){
    let hitMap = [];
    if(this.children.length){
      this.children.forEach((child) => hitMap = hitMap.concat(child.calculateHitmap()));
    } else {
      let cb = this.canvasBounds;
      hitMap.push({
        minX: cb.left,
        maxX: cb.right,
        minY: cb.top,
        maxY: cb.bottom,
        data: this,
      });
    }
   return hitMap;
  }
}
