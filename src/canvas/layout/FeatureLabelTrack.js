/**
 * FeatureLabelTrack
 * A SceneGraphNode representing a collection of labels.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack.js';
import {Bounds} from '../../model/Bounds.js';
import {FeatureLabel} from '../geometry/FeatureLabel.js';

export class FeatureLabelTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group labels for other features
   * @param params
   */

  constructor(params) {
    super(params);
    this.dirty = true;
    this.trackPos = this.parent.trackPos;
    this.generateFeatureLabels(params);
  }

  /**
   * Gets all visible labels, hiding ones that may otherwise be
   * an issue due to overlapping
   */

  get visible() {
    this.locMap.clear();
    this.locMap.load(this.hitMap);
    let view = this.parent.model.view;
    let startY = view.inverse ? view.visible.stop : view.visible.start;
    let stopY = view.inverse ? view.visible.start : view.visible.stop;
    let vis = this.locMap.all().sort((a,b) => {return a.minY-b.minY;}).map(child => {
      child.data.show = false;
      if(!(child.data.position > stopY || child.data.position < startY )) {
        let b = child.data.globalBounds;
        let hits = this.locMap.search({
          maxY: b.top > b.bottom ? b.top : b.bottom,
          minY: b.top < b.bottom ? b.top : b.bottom,
          maxX: b.right,
          minX: b.left
        });

        if (hits.length === 1) {
          child.data.show = true;
        } else {
          let visHits = hits.filter(hit => {
            return hit.data.show;
          });
          if (visHits.length === 0) {
            child.data.show = true;
          }
        }
      }
      return child;
    });
   //
    //return visible;
    return vis;
    //return this.locMap.all();
    //return vis.concat([{data:this}]);
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
    ctx.fillStyle = 'green';

    let gb = this.globalBounds;
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );

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

  generateFeatureLabels(params){

     this.filteredFeatures = [];
     let b = this.parent.bounds;
     this.bounds = new Bounds({
       allowSubpixel: false,
       top: 0,
       left: 0,
       width: this.parent.bounds.width,
       height: b.height
     });
     let fmData = [];
     this.offset = 0;

     this.maxLoc = 0;
     let qtlConf = params.config;

     for( let key in this.parent.model.config.qtl){
       if(!qtlConf.hasOwnProperty(key)){
         qtlConf[key] = this.parent.model.config.qtl[key];
       }
     }

     this.qtlMarks = this.parent.featureData.map( model => {
       let fm = new  FeatureLabel({
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
       if (fm.bounds.left < this.bounds.left && fm.bounds.left < this.offset) {
         this.offset = -(fm.bounds.left);
       }
       if(fm.bounds.right > this.bounds.right && fm.bounds.right > this.offset){
         this.offset = fm.bounds.right - this.bounds.right;
       }
       //if (gb.right > this.globalBounds.right) {
       //  this.bounds.right += gb.right - this.globalBounds.right;
       //}
        fmData.push(loc);
         return fm;
       });

       this.locMap.clear();
       this.locMap.load(fmData);
  }
}
