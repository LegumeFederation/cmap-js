/**
 * Helper functions for calculating canvas points.
 */

// Takes a point on a map and translates it pixel coordinates on the current canvas
export function translateScale(point, baseScale, newScale,invert){
  let loc =  ((baseScale.stop - baseScale.start)*(point-newScale.start)/(newScale.stop-newScale.start)+baseScale.start) - baseScale.start;
  if(invert) {
    return newScale.stop-loc
  }
  return loc;
}

// takes an event and translates the event coordinates to canvas coordinates
export function pageToCanvas(evt, canvas){
  function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }
  let pageOffset = getOffset(canvas);
  return {
    'x': evt.srcEvent.pageX - pageOffset.left,
    'y': evt.srcEvent.pageY - pageOffset.top
  };
}
