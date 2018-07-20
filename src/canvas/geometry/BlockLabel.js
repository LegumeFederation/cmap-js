/**
 *
 * A SceneGraphNode representing a text label for a feature on a Map.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class BlockLabel extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param config - base configuration
   */

  constructor({parent, bioMap, featureModel,config,tempCtx}) {
    super({parent, tags: [featureModel.name]});
    this.config = config;
    this.fm = featureModel;
    this.model = featureModel.model;
    this.view = bioMap.view;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.view.invert;
    this.start = this.invert ? this.model.coordinates.stop : this.model.coordinates.start;
    let y1 = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.show = false;
    tempCtx.font = `${config.labelSize}px ${config.labelFace}`;
    let width = tempCtx.measureText(this.model.name).width;
    console.log("width",width,tempCtx);
    if(width > this.parent.trackMaxWidth){this.parent.trackMaxWidth = width;}
    this.bounds = new Bounds({
      top:  y1 ,
      left: 0,
      width: width,
      height: this.config.labelSize,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    let config = this.config;
    ctx.font = `${config.labelSize}px ${config.labelFace}`;
    let y1 = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let height = config.labelSize ;
    const width = this.bounds.width;
    this.bounds = new Bounds({
        top: y1-height,
        left:  this.parent.trackMaxWidth - width,
        width: width,
        height : height ,
        allowSubpixel: false
    });

    if(!this.show) return;
    let gb = this.globalBounds || {};
    ctx.save();
    ctx.translate(gb.left, gb.bottom);
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.fillText(this.model.name,0, 0);
    ctx.restore();
    // reset bounding box to fit the new stroke location/width
     }
}
