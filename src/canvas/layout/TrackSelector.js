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
