/**
 * Helper functions for calculating canvas points.
 */

export function translateScale(point, baseScale, newScale){
  return ((baseScale.stop - baseScale.start)*(point-newScale.start)/(newScale.stop-newScale.start)+baseScale.start) - baseScale.start;
}
