/**
 * TrackSelector
 * A meta-class that reduces overhead when creating new tracks.
 *
 * @extends SceneGraphNodeTrack
 */

import {ManhattanPlot} from './ManhattanPlot';
import {QtlTrack} from './QtlTrack';
import {LabelTrack} from './LabelTrack';


export function qtl(params){
    return new QtlTrack(params);
}

export function  manhattan(params){
    return new ManhattanPlot(params);
}

export function label (params){
    return new LabelTrack(params);
}
