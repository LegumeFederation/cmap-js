/**
  * SceneGraphNodeBase
  * Base Class representing a drawable element in canvas scenegraph
  */
import { Bounds } from '../model/Bounds';

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
       This is not the same as DOM bounds of the canvas element!
    * @param {Number} rotation - degrees, default 0.
    * @returns {Object}
    */
  constructor({parent, bounds, rotation = 0, tag}) {
    this.parent = parent;
    this._rotation = rotation;
    this._tag = tag;
    this.bounds = bounds;
    this._children = []; // note: subclasses implement own children data structure
  }

  /* define getters for our properties; note subclasses can override setters,
    e.g. to perform layout or calculations based on new state */
  get children() { return this._children; }
  get bounds() { return this._bounds; }
  set bounds(b) { this._bounds = b; }
  get rotation() { return this._rotation; }
  set rotation(degrees) { this._rotation = degrees; }
  get tag() { return this._tag; }
  set tag(s) { this._tag = s; }

  /**
  * Traverse all parents bounds to calculate self Bounds on Canvas.
  *
  * @returns {Object} - Bounds instance
  */
  get globalBounds() {
    console.assert(this.bounds, 'bounds missing');
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

  /**
   * Translate coordinates to canvas space. When an element wants to draw on
   * canvas, it requires translating into global coordinates for the canvas.
   *
   * @param {Object} params - object with following properties:
   * @param {Number} x
   * @param {Number} y
   * @returns {Object} - { x, y }
   */
  translatePointToGlobal({x, y}) {
    let gb = this.globalBounds;
    return {x: x + gb.left, y: y + gb.top};
  }
}
