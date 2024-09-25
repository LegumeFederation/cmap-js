/**
 * @description
 * Bounds
 * Class representing a 2D bounds, having the same properties as a DOMRect.
 * This class can be instantiated by script, unlike DOMRect object itself which
 * comes from the browser's DOM by getBoundingClientRect().
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
 */
import {isNil} from '../util/isNil.js';

export class Bounds {
  /**
   * Create a Bounds, as is traditional must pass in at least top and left corners.
   *
   * @param {Object} params - having the following properties:
   * @param {Number} bottom
   * @param {Number} left
   * @param {Number} right
   * @param {Number} top
   * @param {Number} width
   * @param {Number} height
   * @returns {Object}
   */
  constructor({top, left, bottom, right, width, height, allowSubpixel = true}) {
    this._bottom = bottom;
    this._left = left;
    this._right = right ;
    this._top = top;
    this._height = height;
    this._width = width;
    this.allowSubpixel = allowSubpixel;

    if (isNil(this.width)) this._width = this.right - this.left;
    if (isNil(this.height)) this._height = this.bottom - this.top;
    if (isNil(this.bottom)) this._bottom = this.top + this.height;
    if (isNil(this.right)) this._right = this.left + this.width;

    if (!allowSubpixel) {
      // noinspection JSSuspiciousNameCombination
      this._bottom = Math.floor(this.bottom);
      // noinspection JSSuspiciousNameCombination
      this._top = Math.floor(this.top);
      this._left = Math.floor(this.left);
      this._right = Math.floor(this.right);
      this._width = Math.floor(this.width);
      // noinspection JSSuspiciousNameCombination
      this._height = Math.floor(this.height);
      if (this.x) this.x = Math.floor(this.x);
      if (this.y) { // noinspection JSSuspiciousNameCombination
        this.y = Math.floor(this.y);
      }
    }
  }

  /**
   * Getters and setters, should be allowed to update bounds without having to
   * resort to making a new bounds object.
   */

  get bottom() {
    return this._bottom;
  }

  set bottom(val) {
    if (this.allowSubpixel) {
      this._bottom = val;
      this._height = this._bottom - this._top;
    } else {
      this._bottom = Math.floor(val);
      this._height = Math.floor(this._bottom - this._top);
    }
  }

  get top() {
    return this._top;
  }

  set top(val) {
    if (this.allowSubpixel) {
      this._top = val;
      this._height = this._bottom - this._top;
    } else {
      this._top = Math.floor(val);
      this._height = Math.floor(this._bottom - this._top);
    }
  }

  get left() {
    return this._left;
  }

  set left(val) {
    if (this.allowSubpixel) {
      this._left = val;
      this._width = this._right - this._left;
    } else {
      this._left = Math.floor(val);
      this._width = Math.floor(this._right - this._left);
    }
  }

  get right() {
    return this._right;
  }

  set right(val) {
    if (this.allowSubpixel) {
      this._right = val;
      this._width = this._right - this._left;
    } else {
      this._right = Math.floor(val);
      this._width = Math.floor(this._right - this._left);
    }
  }

  get width() {
    return this._width;
  }

  set width(val) {
    if (this.allowSubpixel) {
      this._width = val;
      this._right = this._left + this._width;
    } else {
      this._right = Math.floor(val);
      this._width = Math.floor(this._left + this._width);
    }
  }

  get height() {
    return this._height;
  }

  set height(val) {
    if (this.allowSubpixel) {
      this._height = val;
      this._bottom = this._top + this._height;
    } else {
      this._height = Math.floor(val);
      this._bottom = Math.floor(this._top + this._height);
    }
  }

  /**
   * Check if width or height is zero, making the Bounds effectively empty.
   */
  get isEmptyArea() {
    return !this.width || !this.height;
  }

  /**
   * Area of bounds (width * height)
   */
  get area() {
    return this.width * this.height;
  }

  /**
   * Class method- test whether two bounds are equal (rounds to nearest pixel)
   *
   * @param bounds1 - DOMRect or Bounds instance
   * @param bounds2 - DOMRect or Bounds instance
   * @returns Boolean
   */
  static equals(bounds1, bounds2) {
    let p, n1, n2;
    if (!bounds1 || !bounds2)
      return false; // check for null args
    for (let i = 0; i < PROPS.length; i++) {
      p = PROPS[i];
      n1 = bounds1[p];
      n2 = bounds2[p];
      if (n1 === undefined || n2 === undefined) { // skip test, see note about x,y
        continue;
      }
      // cast properties from float to int before equality comparison
      if (Math.floor(n1) !== Math.floor(n2))
        return false;
    }
    return true;
  }

  /**
   * Class method- test whether two bounds are equal in area (rounds to nearest pixel)
   *
   * @param bounds1 - DOMRect or Bounds instance
   * @param bounds2 - DOMRect or Bounds instance
   * @returns Boolean
   */
  static areaEquals(bounds1, bounds2) {
    if (!bounds1 || !bounds2)
      return false; // check for null args
    return Math.floor(bounds1.area) === Math.floor(bounds2.area);
  }

  /**
   * Instance method call of Bounds.equals()
   */
  equals(otherBounds) {
    return Bounds.equals(this, otherBounds);
  }

  /**
   * Area equality, rounds to integer pixel.
   */
  areaEquals(otherBounds) {
    return Bounds.areaEquals(this, otherBounds);
  }

  /**
   * Translates bounds by x and y
   */
  translate(x,y){
    if (this.allowSubpixel) {
      if(x !== 0) {
        this._left += x;
        this._right += x;
      }
      if(y!==0) {
        this._top += y;
        this._bottom += y;
      }
    } else {
      if(x !== 0) {
        x = Math.floor(x);
        this._left += x;
        this._right += x;
      }
      if(y!==0) {
        y = Math.floor(y);
        this._top += y;
        this._bottom += y;
      }
    }
  }
}

// DOMRect may *not* have iterable properties, so hardcode them here
const PROPS = [
  // note: x any y may not exist!
  'bottom', 'left', 'right', 'top', 'width', 'height', 'x', 'y'
];
