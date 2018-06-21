/**
 * LabelTrack
 * A SceneGraphNode representing a collection of labels.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {Bounds} from '../../model/Bounds';
import {Label} from '../geometry/Label';

export class LabelTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group labels for other features
   * @param params
   */

  /**
   * TODO: Allow for subtracks
   */

  constructor(params) {
    super(params);
    this.dirty = true;
    this.trackPos = this.parent.trackPos;
    //don't draw labels if they aren't to be shown
    let labelPosition = params.config.labelPosition;
    if (labelPosition === 'none') return;
    if(labelPosition === 'feature'){
      this.filteredFeatures = [];
      let b = this.parent.bounds;
      this.bounds = new Bounds({
        allowSubpixel: false,
        top: 0,
        left: 0,
        width: this.parent.model.config.qtl.trackMinWidth,
        height: b.height
      });
      let fmData = [];

      this.maxLoc = 0;
      let qtlConf = params.config;

      for( let key in this.parent.model.config.qtl){
        if(!qtlConf.hasOwnProperty(key)){
          qtlConf[key] = this.parent.model.config.qtl[key];
        }
      }

      this.qtlMarks = this.parent.featureData.map( model => {
        let fm = new  Label({
          featureModel: model,
          parent: this,
          bioMap: this.parent.model,
          initialConfig: qtlConf,
          config: qtlConf
        });

        this.addChild(fm);
        let gb = fm.globalBounds;
        let loc = {
          minY: gb.top < gb.bottom ? gb.top : gb.bottom,
          maxY: gb.top > gb.bottom ? gb.top : gb.bottom,
          minX: gb.left,
          maxX: gb.right,
          data:fm
        };

        this.locMap.insert(loc);

        fmData.push(loc);

//        if(fm.globalBounds.right > this.globalBounds.right){
//          this.bounds.right = fm.globalBounds.right - this.globalBounds.left;
//        }

        return fm;
      });
      this.locMap.clear();
      this.locMap.load(fmData);
    }
  }

  /**
   * Gets all visible labels, hiding ones that may otherwise be
   * an issue due to overlapping
   */

  get visible() {
    this.locMap.clear();
    this.locMap.load(this.hitMap);
    this.children.forEach(child => {
      child.show = false;
      let b = child.globalBounds;
      let hits = this.locMap.search({
        maxY: b.top > b.bottom ? b.top : b.bottom,
        minY: b.top < b.bottom ? b.top : b.bottom,
        maxX : b.right,
        minX : b.left
      });

      if(hits.length === 1) {
        child.show = true;
      } else {
       let visHits =  hits.filter(hit => {
         return hit.data.show;
        });
       if(visHits.length === 0){
         child.show = true;
       }
      }
    });
   //
   // return visible;
    return this.locMap.all();
    //return [{data:this}];
    //return this.locMap.all().concat([{data:this}]); // debugging statement to test track width bounds
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
    ctx.restore();
  }

  /**
   * Get RTree children that are visible in the canvas' current zoom bounds
   * @returns {Array}
   */

  get hitMap() {
    //return this.locMap.all();
    return this.children.map(child => {
      return {
        maxY: child.globalBounds.top,
        minY: child.globalBounds.bottom,
        minX: child.globalBounds.left,
        maxX: child.globalBounds.right,
        data: child
      };
    });
  }
}
