/**
 * FeatureLabelTrack
 * A SceneGraphNode representing a collection of labels.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {Bounds} from '../../model/Bounds';
import {FeatureLabel} from '../geometry/FeatureLabel';
import {BlockLabel} from '../geometry/BlockLabel';

export class FeatureLabelTrack extends SceneGraphNodeTrack {
  constructor(params) {
    super(params);
    this.config = params.config;
    this.data = params.data;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left : 0,
      height: this.parent.bounds.height,
      width: this.parent.bounds.width,
    });
    this.generateFeatureLabels();
    this.labelsScaled = false;
  }

  /**
   * Gets all visible labels, hiding ones that may otherwise be
   * an issue due to overlapping
   */

  get visible() {
    return this.locMap.all();
  }

  /**
   * Debug draw to check track positioning
   * @param ctx
   */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = 'green';

     let gb = this.canvasBounds;
     ctx.fillRect(
       Math.floor(gb.left),
       Math.floor(gb.top),
       Math.floor(gb.width),
       Math.floor(gb.height)
     );
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
      width: this.bounds ? this.bounds.width : b.width,
      height: b.height
    });
    this.updateLocMap();
  }

  generateFeatureLabels(){
    let labels = [];
    this.maxLoc = 0;

    // create a temp canvas context to
    let tempCanvas = document.createElement('canvas');
    tempCanvas.setAttribute('width',1000);
    tempCanvas.setAttribute('height',1000);
    const tmpCtx = tempCanvas.getContext('2d');
    this.data.forEach( d => {
        let fm = new  FeatureLabel({
          parent: this,
          data: d.data,
          config: this.config,
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
      });

      this.locMap.clear();
      this.locMap.load(labels);
  }
  calculateHits(point){
    return [];
  }
}
