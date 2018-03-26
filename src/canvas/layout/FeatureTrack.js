/**
 * FeatureTrack
 * A SceneGraphNode representing a collection of tracks.
 *
 * @extends SceneGraphNodeTrack
 */

import {Bounds} from '../../model/Bounds';

import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {ManhattanPlot} from './ManhattanPlot';
import {QtlTrack} from './QtlTrack';

export class FeatureTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group of QTL rectangles
   * @param params
   */

  constructor(params) {
    super(params);
    this.model = this.parent.model;
    const b = this.parent.bounds;
    this.trackPos = params.position || 1;

    let left = this.trackPos < 0 ? 10 : this.parent.bbGroup.bounds.right;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.top,
      left: left,
      width: 0,
      height: b.height
    });
    if(this.parent.model.tracks) {
      let tracks = this.trackPos === 1 ? this.parent.tracksLeft : this.parent.tracksRight;
      tracks.forEach((track, order) => {
        // newFeatureTrack is a group with two components, the feature data track, and the feature label track
        track.appState = this.parent.appState;
        let newFeatureTrack = new SceneGraphNodeGroup({parent:this});
        newFeatureTrack.model = this.model;
        newFeatureTrack.config = track;
        newFeatureTrack.order = order;

        let trackLeft = order === 0 ? 0 : this.children[order-1].bounds.right;
        trackLeft += this.model.config.qtl.padding;

        newFeatureTrack.bounds = new Bounds({
          allowSubpixel: false,
          top: 0,
          left: trackLeft,
          width: this.model.config.qtl.trackMinWidth,
          height: b.height
        });


        let featureData = {};
        if(track.type === 'qtl') {
          featureData = new QtlTrack({parent:newFeatureTrack , config: track});
          newFeatureTrack.title = track.title || this.model.config.qtl.title || track.filters[0];
        } else if( track.type === 'manhattan') {
          featureData = new ManhattanPlot({parent:newFeatureTrack, config: track});
          newFeatureTrack.title = track.title || this.model.config.manhattan.title || 'Manhattan';
        }

        newFeatureTrack.addChild(featureData);
        if(featureData.globalBounds.right > newFeatureTrack.globalBounds.right){
          newFeatureTrack.bounds.right += featureData.bounds.right;
        }

        if(newFeatureTrack.globalBounds.right > this.globalBounds.right){
          this.bounds.right =  this.bounds.left + (newFeatureTrack.globalBounds.right - this.globalBounds.left);
        }

        this.addChild(newFeatureTrack);
      });
    } else {
      this.parent.model.tracks = [];
    }

  }

  /**
   *
   */

  get visible() {
    let visible = [];
    this.children.forEach(child => {
      visible = visible.concat(child.visible);
    });
    return visible;
    //return visible.concat([{data:this}]); // debugging statement to test track width bounds
  }

  /**
   * Debug draw to check track positioning
   * @param ctx
   */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = '#ADD8E6';
    this.children.forEach(child => {
      let cb = child.globalBounds;
      // noinspection JSSuspiciousNameCombination
      // noinspection JSSuspiciousNameCombination
      ctx.fillRect(
        Math.floor(cb.left),
        Math.floor(cb.top),
        Math.floor(cb.width),
        Math.floor(cb.height)
      );
    });
    //ctx.fillStyle = 'red';
    //let cb = this.globalBounds;
    //ctx.fillRect(
    //  Math.floor(cb.left),
    //  Math.floor(cb.top),
    //  Math.floor(cb.width),
    //  Math.floor(cb.height)
    //);
    ctx.restore();
  }

  /**
   * Get RTree children that are visible in the canvas' current zoom bounds
   * @returns {Array}
   */

  get hitMap() {
    //return [];
   // console.log('hits child',child);
    let hits = [];
    this.children.forEach(child => {
      return child.children.map(qtlGroup => {
        hits = hits.concat(qtlGroup.hitMap);
      });
    });
    return hits;
  }
}
