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
  * @param {Number} bottom;
  * @param {Number} left;
  * @param {Number} right;
  * @param {Number} top;
  * @param {Number} width;
  * @param {Number} height;
  * @returns {Object}
  */
  constructor({bottom, left, right, top, width, height}) {
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.top = top;
    this.height = height;
    this.width = width;
  }
}
