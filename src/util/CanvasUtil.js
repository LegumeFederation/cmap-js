/**
 * Helper functions for calculating canvas points.
 */

// Takes a point on a map and translates it from the newScale to the baseScale scale
export function translateScale(point, baseScale, newScale,invert){
  let loc =  ((baseScale.stop - baseScale.start)*(point-newScale.start)/(newScale.stop-newScale.start)+baseScale.start) - baseScale.start;
  if(invert) {
    loc =  (baseScale.start+baseScale.stop)-loc;
  }
  return loc;
}

// takes an event and translates the event coordinates to canvas coordinates
// here because webkit events vs mozilla events vs ie events don't all have
// the same data
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
