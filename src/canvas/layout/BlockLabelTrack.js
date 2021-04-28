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
    this.config = params.config;
    this.data = params.data;
    this.trackMaxWidth = 40;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left : 0,
      height: this.parent.bounds.height,
      width: this.trackMaxWidth
    });
    this.generateBlockLabels(params);
    this.bounds.right = this.bounds.left + this.trackMaxWidth;
    this.bounds.width = this.trackMaxWidth;
    this.updateLocMap();
    this.labelsScaled = false;
  }

  /**
   * Gets all visible labels, hiding ones that may otherwise be
   * an issue due to overlapping
   */

  get visible() {
    let vis = [];
    this.children.forEach(child => child.updateBounds());
    this.updateLocMap();
    let overlappingLabels = [];
    let labels = this.locMap.all();
    labels.sort((a,b) => {return a.minY-b.minY;}).forEach(child => {
      if(overlappingLabels.indexOf(child) !== -1){
        return;
      }
      let cb = child.data.bounds;
      overlappingLabels = this.locMap.search({
        maxY: cb.bottom+1,
        minY: cb.top-1,
        minX: cb.left,
        maxX: cb.right,
      });
      //overlappingLabels.sort((a,b) => {return a.minY - b.minY;});
      if(overlappingLabels.length > 1){
        let landmarks = overlappingLabels.filter(label => {
          if(label.data.show){
            vis.push(label);
            return true;
          }
          return false;
        });
        if(landmarks.length){
          return;
        }
      }
      child.data.show = true;
      vis.push(child);
    });
    return vis;
  }

  /**
   * Debug draw to check track positioning
   * @param ctx
   */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    //ctx.fillStyle = 'green';

   // let gb = this.canvasBounds;
   // ctx.fillRect(
   //   Math.floor(gb.left),
   //   Math.floor(gb.top),
   //   Math.floor(gb.width),
   //   Math.floor(gb.height)
   // );

  //  ctx.fillStyle = 'gray';
  //  this.children.forEach(child => {
  //    let cb = child.canvasBounds;
  //    // noinspection JSSuspiciousNameCombination
  //    // noinspection JSSuspiciousNameCombination
  //    ctx.fillRect(
  //      Math.floor(cb.left),
  //      Math.floor(cb.top),
  //      Math.floor(cb.width),
  //      Math.floor(cb.height)
  //    );
  //  });
   ctx.restore();
   this.children.forEach(child => child.draw(ctx));
  }

  /**
   * Get RTree children that are visible in the canvas' current zoom bounds
   * @returns {Array}
   */

  updateLocMap() {
    const updated =  this.locMap.all().map(child => {
      return {
        maxY: child.data.bounds.bottom,
        minY: child.data.bounds.top,
        minX: child.data.bounds.left,
        maxX: child.data.bounds.right,
        data: child.data
      };
    });
    this.locMap.clear();
    this.locMap.load(updated);
  }

  layout() {
    let b = this.parent.bounds;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: this.bounds ? this.bounds.left :  0,
      width: this.bounds ? this.bounds.width : this.trackMaxWidth,
      height: b.height
    });
    this.updateLocMap();
  }

  generateBlockLabels(params){
    this.filteredFeatures = [];

    let labels = [];

    this.maxLoc = 0;
    let qtlConf = params.config;

    // create a temp canvas context to
    let tempCanvas = document.createElement('canvas');
    tempCanvas.setAttribute('width',1000);
    tempCanvas.setAttribute('height',1000);
    const tmpCtx = tempCanvas.getContext('2d');
    this.qtlMarks = this.data.map( d => {
      let fm = new  BlockLabel({
        parent: this,
        data: d.model,
        config: qtlConf,
        tmpCtx: tmpCtx,
      });
      this.addChild(fm);

      let gb = fm.canvasBounds;
      let loc = {
        minY: gb.top,
        maxY: gb.bottom,
        minX: gb.left,
        maxX: gb.right,
        data:fm
      };

      labels.push(loc);
      return fm;
    });

    this.offset = params.config.labelPosition || params.config.position || 1;

    this.locMap.clear();
    this.locMap.load(labels);
  }

  calculateHits(point){
    return [];
  }
}
