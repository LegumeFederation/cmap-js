/**
 * BlockLabelTrack
 * A SceneGraphNode representing a collection of labels.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {Bounds} from '../../model/Bounds';
import{BlockLabel} from '../geometry/BlockLabel';

export class BlockLabelTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group labels for other features
   * @param params
   */

  constructor(params) {
    super(params);
    this.dirty = true;
    this.trackPos = this.parent.trackPos;
    //don't draw labels if they aren't to be shown
    this.generateBlockLabels(params);
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


  generateBlockLabels(params){
    this.filteredFeatures = [];
    this.trackMaxWidth = 10;
    let b = this.parent.bounds;
    let trackpos = params.config.labelPosition || params.config.position || 1;
    const startLeft = trackpos >= 0 ? b.right : b.left;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left : startLeft,
      right: this.parent.featureGroup.bounds.right,
      height: b.height
    });
    let fmData = [];

    this.maxLoc = 0;
    let qtlConf = params.config;
    // create a temp canvas context to
    let tempCanvas = document.createElement('canvas');
    tempCanvas.setAttribute('width',1000);
    tempCanvas.setAttribute('height',1000);
    let tempCtx = tempCanvas.getContext('2d');
    //for( let key in this.parent.model.config.qtl){
    //  if(!qtlConf.hasOwnProperty(key)){
    //    qtlConf[key] = this.parent.model.config.qtl[key];
    //  }
    //}
    this.qtlMarks = this.parent.featureData.map( model => {
      let fm = new  BlockLabel({
        featureModel: model,
        parent: this,
        bioMap: this.parent.model,
        initialConfig: qtlConf,
        config: qtlConf,
        tempCtx: tempCtx
      });

      //if(this.bounds.left+this.trackMaxWidth > this.bounds.right){
      //  this.bounds.width = this.trackMaxWidth;
      //}

      this.addChild(fm);
      let gb = fm.globalBounds;
      let loc = {
        minY: gb.top,
        maxY: gb.bottom,
        minX: this.globalBounds.left,
        maxX: this.globalBounds.right,
        data:fm
      };

      this.locMap.insert(loc);
      fmData.push(loc);
      return fm;
    });

    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: trackpos > 0 ? b.right : - this.trackMaxWidth,
      width: this.trackMaxWidth,
      height: b.height
    });
    this.offset = trackpos > 0? this.trackMaxWidth : -this.trackMaxWidth;
    this.locMap.clear();
    this.locMap.load(fmData);
  }
}
