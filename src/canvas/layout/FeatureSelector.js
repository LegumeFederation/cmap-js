/**
 * TrackSelector
 * A meta-class that reduces overhead when creating new tracks.
 *
 * @extends SceneGraphNodeTrack
 */

import {ManhattanPlot} from './ManhattanPlot';
import {QtlTrack} from './QtlTrack';

export function feature(params) {
  let featureStyle = params.featureStyle;
  if (featureStyle === 'qtl') {
    return new QtlTrack(params);
  } else if (featureStyle === 'manhattan') {
    return new ManhattanPlot(params);
  }
  return undefined;
}

