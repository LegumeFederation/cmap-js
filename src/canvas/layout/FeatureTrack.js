/**
 * FeatureTrack
 * A SceneGraphNode representing a collection of tracks.
 *
 * @extends SceneGraphNodeTrack
 */

import {Bounds} from '../../model/Bounds';

import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';

import * as trackSelector from './TrackSelector';

export class FeatureTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a collection of data display tracks
   * @param params
   */

  constructor(params) {
    super(params);
    this.model = this.parent.model;
    const b = this.parent.bounds;
    this.trackPos = params.position || 1;

    let left = this.trackPos < 0 ? 10 : this.parent.backbone.canvasBounds.right;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.top,
      left: left,
      width: 0,
      height: b.height
    });

    if(this.parent.model.tracks) {
      let tracks = this.trackPos < 1 ? this.parent.tracksLeft : this.parent.tracksRight;
      tracks.forEach((track, order) => {
        // newFeatureTrack is a group with two dataSourceComponents, the feature data track, and the feature label track
        //track.appState = this.parent.appState;
        let newFeatureTrack = new SceneGraphNodeGroup({parent:this});
        newFeatureTrack.model = this.model;
        newFeatureTrack.config = track;
        newFeatureTrack.order = order;
        newFeatureTrack.trackPos = this.trackPos;

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
        this.labels = [];
        //Load feature tracks and labels
        //TODO: Add track adaptor class to prevent this type of mess
        //if(track.type === 'qtl') {
        //  newFeatureTrack.title = track.title || this.model.config.qtl.title || track.filters[0];
        //  featureData = new QtlTrack({parent:this , config: track});
        //  newFeatureTrack.featureData = featureData.children;
        //  //newFeatureTrack.labels = new FeatureLabelTrack({parent:newFeatureTrack, config:track});
        //} else if( track.type === 'manhattan') {
        //  newFeatureTrack.sources = this.parent.appState.sources;
        //  newFeatureTrack.title = track.title || this.model.config.manhattan.title || 'Manhattan';
        //  featureData = new ManhattanPlot({parent:newFeatureTrack, config: track});
        //}
        newFeatureTrack.sources = this.parent.appState.sources;
        let trackType = track.type.toLowerCase();
        featureData = trackSelector.feature({parent: newFeatureTrack, config: track, featureStyle: trackType});
        if (featureData !== undefined) { //only add if valid track
          newFeatureTrack.title = track.title || this.model.config[trackType].title || trackType;
          this.addChild(newFeatureTrack);
          newFeatureTrack.addChild(featureData);
          if (newFeatureTrack.canvasBounds.right > this.canvasBounds.right) {
            this.bounds.right = this.bounds.left + (newFeatureTrack.canvasBounds.right - this.canvasBounds.left);
          }
          //if(newFeatureTrack.canvasBounds.right > this.canvasBounds.right){
          //  this.bounds.right =  this.bounds.left + (newFeatureTrack.canvasBounds.right - this.canvasBounds.left);
          //}
          newFeatureTrack.offset = newFeatureTrack.canvasBounds;
        }

       //Shift newFeature track bounds for wide feature glyphs
        // if(featureData.canvasBounds.right > newFeatureTrack.canvasBounds.right){
       //   newFeatureTrack.bounds.right += featureData.bounds.right;
       // }
        //Shift newFeature track bounds for wide labels
        //if(newFeatureTrack.labels) console.log("labPost", newFeatureTrack.labels.canvasBounds.left, newFeatureTrack.canvasBounds.left);
        //if(newFeatureTrack.labels && newFeatureTrack.labels.canvasBounds.right > newFeatureTrack.canvasBounds.right) {
        //  newFeatureTrack.bounds.right = newFeatureTrack.bounds.right + newFeatureTrack.labels.bounds.right;
        //}
        //if(newFeatureTrack.labels && newFeatureTrack.labels.canvasBounds.left < newFeatureTrack.canvasBounds.left){

        //  const offset = (newFeatureTrack.canvasBounds.left - newFeatureTrack.labels.canvasBounds.left);
        //  this.bounds.left += offset;
        //  this.bounds.width += (offset);
        //  //newFeatureTrack.bounds.left += offset;
        //  //newFeatureTrack.bounds.right += offset;
       // }

        //shift this tracks's bounds so it still fits in the canvas

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
      if(child.labels){
        visible = visible.concat(child.labels.visible);
      }
    });
    //return visible;
    return visible.concat([{data: this}]); // debugging statement to test track width bounds
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
      console.log('ft draw', child.canvasBounds);
      let cb = child.canvasBounds;
      // noinspection JSSuspiciousNameCombination
      // noinspection JSSuspiciousNameCombination
      ctx.fillRect(
        Math.floor(cb.left),
        Math.floor(cb.top),
        Math.floor(cb.width),
        Math.floor(cb.height)
      );
    });
    // ctx.fillStyle = 'red';
    // let cb = this.canvasBounds;
    // ctx.fillRect(
    //   Math.floor(cb.left),
    //   Math.floor(cb.top),
    //   Math.floor(cb.width),
    //   Math.floor(cb.height)
    // );
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
