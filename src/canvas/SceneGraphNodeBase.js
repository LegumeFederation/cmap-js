/**
  * SceneGraphNodeBase
  * Base Class representing a drawable element in canvas scenegraph
  */

import  rbush  from 'rbush';

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
  constructor({parent, bounds, rotation = 0, tags = []}) {
    this.parent = parent;
    if(parent){
      this.mapCoordinates = parent.mapCoordinates;
    }
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
  get children() { return this._children; }
  get bounds() { return this._bounds; }
  set bounds(b) { this._bounds = b; }
  get rotation() { return this._rotation; }
  get tags() { return this._tags; }
  get visible(){ 
    let vis = [];
    let childVisible = this.children.map( child => {
      return child.locMap.all();
    });
    childVisible.forEach(item =>{ vis = vis.concat(item);});
    return vis;
  }
  /* setters */
  set children(b) { this._children = b;}
  set rotation(degrees) { this._rotation = degrees; }
  set tags(tags) { this._tags = tags; }

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
   *  Traverse children, returning hitmap
   *
   *  @returns {Array} - array of rbush entries
   */

  get hitMap(){
    let hits = [];
    let childMap = this.children.map( child => {
      return child.hitMap;
    });
    childMap.forEach(item =>{ hits = hits.concat(item);});
    return hits;
  }

	/* public methods/*
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

  /**
   * Adds a child node to the _children array
   * and changes child node's parent to this node
   *
   * @param {object} node - SceneGraphNode derived item to insert as a child
   **/
  addChild(node){
    if(node.parent){
      node.parent.removeChild(node);
    }
    node.parent = this;
    if(this._children.indexOf(node) === -1)  this._children.push(node);
  }

  /**
   * Removes a child node from the _children array
   * and changes child node's parent to this node
   *
   * @param {object} node - SceneGraphNode derived node to remove
   **/
  removeChild(node){
    //TODO: May need to use a indexOf polyfill if targeting IE < 9
    let index = this._children.indexOf(node);
    if(index > -1){
      this._children.splice(index,1);
    }
  }
  /**
   * Traverse children and call their draw on the provided context
   *
   * #param {object} ctx - canvas context
   *
   */
  draw(ctx){
    this.children.forEach(child => child.draw(ctx));
  }
}
