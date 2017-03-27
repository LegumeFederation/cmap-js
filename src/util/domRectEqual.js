/**
  * Test whether two bounds are equal (rounds to nearest pixel)
  *
  * @param bounds1 - DOMRect or Bounds instance
  * @param bounds2 - DOMRect or Bounds instance
  * @returns Boolean
  */
const domRectEqual = (bounds1, bounds2) => {
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
};

// DOMRect may have iterable properties, so hardcode them here
const PROPS = [
  // note: x any y may not exist!
  'bottom', 'left', 'right', 'top', 'width', 'height', 'x', 'y'
];

export { domRectEqual };
