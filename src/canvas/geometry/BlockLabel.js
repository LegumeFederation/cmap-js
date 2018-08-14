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
   * @param tempCtx - temp canvas to measure display size for offsets
   */

  constructor({parent, bioMap, featureModel,config,tempCtx}) {
    super({parent, tags: [featureModel.name]});
    this.config = config;
    this.fm = featureModel;
    this.model = featureModel.model;
    this.view = bioMap.view;
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.invert = bioMap.view.invert;
    this.position = this.invert ? this.model.coordinates.stop : this.model.coordinates.start;
    this.labelPos = config.labelPosition || config.position;
    this.padding = config.labelPadding || 0;
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.show = false;
    tempCtx.font = `${config.labelSize}px ${config.labelFace}`;
    this.width = tempCtx.measureText(this.model.name).width + this.padding;
    if(this.width > this.parent.trackMaxWidth){this.parent.trackMaxWidth = this.width;}
    this.bounds = new Bounds({
      top:  y1 + (config.labelSize/2) ,
      bottom: y1 - (config.labelSize/2),
      left: 0,
      width: 0,
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
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let height = config.labelSize ;
    const width = this.bounds.width;
    if(width === 0) {  // only need to do new bounds once as fully replacing takes longer than shifting.
      this.bounds = new Bounds({
        top: y1+(height/2),
        bottom: y1-(height/2),
        left: this.labelPos >= 0 ? this.padding :this.parent.trackMaxWidth-this.width,
        width: this.width,
        allowSubpixel: false
      });
    } else {
      this.bounds.top = y1+(height/2);
      this.bounds.bottom = y1-(height/2);
    }
    if(!this.show) return;


    let gb = this.globalBounds || {};
    ctx.save();
    ctx.translate(gb.left, gb.top);
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.fillText(this.model.name,0, 0);
    ctx.restore();
    // reset bounding box to fit the new stroke location/width
     }
}
