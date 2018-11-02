/**
 * TrackSelector
 * A meta-class that reduces overhead when creating new tracks.
 *
 * @extends SceneGraphNodeTrack
 */

import {ManhattanPlot} from './ManhattanPlot';
import {QtlTrack} from './QtlTrack';
import {FeatureLabelTrack} from './FeatureLabelTrack';
import {BlockLabelTrack} from './BlockLabelTrack';

export function feature(params) {
  let featureStyle = params.featureStyle;
  if (featureStyle === 'qtl') {
    return new QtlTrack(params);
  } else if (featureStyle === 'manhattan') {
    return new ManhattanPlot(params);
  }
  return undefined;
}

export function label (params){
  let labelStyle = params.config.labelStyle;
  if(labelStyle === 'feature'){
    return new FeatureLabelTrack(params);
  } else if (labelStyle === 'block'){
    return new BlockLabelTrack(params);
  }
  return undefined;
}
