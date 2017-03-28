/**
  * Class representing a 2D bounds, having the same properties as a DOMRect.
  * This class can be instantiated by script, unlike DOMRect object itself which
  * comes from the browser's DOM by getBoundingClientRect().
  * https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  */
export class Bounds {
  /**
  * Create a Bounds
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
  constructor({bottom, left, right, top, width = null, height = null}) {
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.top = top;
    this.height = height;
    if(! width) this.width = right - left;
    else this.width = width;
    if(! height) this.height = bottom - top;
    else this.height = height;
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
    if(! bounds1 || ! bounds2)
      return false; // check for null args
    for (var i = 0; i < PROPS.length; i++) {
      p = PROPS[i];
      n1 = bounds1[p];
      n2 = bounds2[p];
      if(n1 === undefined || n2 === undefined) { // skip test, see note about x,y
        continue;
      }
      // cast properties from float to int before equality comparison
      if(Math.floor(n1) !== Math.floor(n2))
        return false;
    }
    return true;
  }

  /**
   * Instance method call of Bounds.equals()
   */
  equals(otherBounds) {
    return Bounds.equals(this, otherBounds);
  }
}

// DOMRect may *not* have iterable properties, so hardcode them here
const PROPS = [
  // note: x any y may not exist!
  'bottom', 'left', 'right', 'top', 'width', 'height', 'x', 'y'
];
