/**
 * TrackSelector
 * A meta-class that reduces overhead when creating new tracks.
 *
 * @extends SceneGraphNodeTrack
 */

import {ManhattanPlot} from './ManhattanPlot.js';
import {QtlTrack} from './QtlTrack.js';
import {FeatureLabelTrack} from './FeatureLabelTrack.js';
import {BlockLabelTrack} from './BlockLabelTrack.js';


export function qtl(params){
    return new QtlTrack(params);
}

export function  manhattan(params){
    return new ManhattanPlot(params);
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
