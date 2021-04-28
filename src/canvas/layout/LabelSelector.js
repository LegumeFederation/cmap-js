/**
 * LabelSelector
 * A meta-class that reduces overhead when creating new label tracks.
 *
 */

import {FeatureLabelTrack} from './FeatureLabelTrack';
import {BlockLabelTrack} from './BlockLabelTrack';

export function label (params){
  let labelStyle = params.config.labelStyle;
  if(labelStyle === 'feature'){
    return new FeatureLabelTrack(params);
  } else if (labelStyle === 'block'){
    return new BlockLabelTrack(params);
  }
  return undefined;
}
