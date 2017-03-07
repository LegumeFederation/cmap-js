/*
a DOMRect, from Element.getBoundingClientRect() is composed of float properties:

bottom  float  Y-coordinate, relative to the viewport origin, of the bottom of the rectangle box. Read only.
height  float  Height of the rectangle box (This is identical to bottom minus top). Read only.
left  float  X-coordinate, relative to the viewport origin, of the left of the rectangle box. Read only.
right  float  X-coordinate, relative to the viewport origin, of the right of the rectangle box. Read only.
top  float  Y-coordinate, relative to the viewport origin, of the top of the rectangle box. Read only.
width  float  Width of the rectangle box (This is identical to right minus left). Read only.
x  float  X-coordinate, relative to the viewport origin, of the left of the rectangle box. Read only.
y  float  Y-coordinate, relative to the viewport origin, of the top of the rectangle box. Read only.
*/

// domrect has no iterable properties, so hardcode them here
const PROPS = [
  // note: x any y may not exist!
  'bottom', 'height', 'left', 'right', 'top', 'width', 'x', 'y'
];

// domRectEqual()
// for testing: are 2 domrects equal?
// cast properties from float to int before equality comparison
export let domRectEqual = (bounds1, bounds2) => {
  let p, n1,n2;
  if(! bounds1 || ! bounds2)
    return false; // check for null args
  for (var i = 0; i < PROPS.length; i++) {
    p = PROPS[i];
    n1 = bounds1[p];
    n2 = bounds2[p];
    if(n1 === undefined || n2 === undefined) { // skip test, see note about x,y
      continue;
    }
    if(Math.floor(n1) !== Math.floor(n2))
      return false;
  }
  return true;
};
