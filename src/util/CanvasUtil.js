/**
 * @file Helper functions for calculating canvas points.
 */

/**
 * Takes a point on a map and translates it from the newScale to the baseScale scale
 * @param point - Map point in terms of new scale
 * @param baseScale - largest and smallest possible values of the scale
 * @param newScale - largest and smallest values of the adjusted scale
 * @param {boolean} invert - is the scale to be drawn "flipped"
 * @returns {number} point converted from location on new scale to location on base scale
 */

export function translateScale(point, baseScale, newScale, invert) {
  let loc = ((baseScale.stop - baseScale.start) * (point - newScale.start) / (newScale.stop - newScale.start) + baseScale.start) - baseScale.start;
  if (invert) {
    loc = (baseScale.start + baseScale.stop) - loc;
  }
  return loc;
}

/**
 * Takes an event and translates the event coordinates to canvas coordinates
 * here because webkit events vs mozilla events vs ie events don't all provide
 * the same data
 *
 * @param evt - dom event
 * @param canvas - target canvas
 * @returns {{x: number, y: number}} location translated from page event coordinates to canvas coordinates.
 */

export function pageToCanvas(evt, canvas) {
  function getOffset(el) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {top: _y, left: _x};
  }

  let pageOffset = getOffset(canvas);
  return {
    'x': evt.srcEvent.pageX - pageOffset.left,
    'y': evt.srcEvent.pageY - pageOffset.top
  };
}

export function remToPix(rem) {
  return rem * parseFloat(getComputedStyle(document.getElementById('cmap-app')).fontSize);
}
