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
   * @param config - base configuration
   */

  constructor({parent:parent, data: data, config:config, tmpCtx: tmpCtx}) {
    super({parent, tags: [data.name]});
    this.config = config;
    this.data = data;
    this.position = this.view.invert ? data.coordinates.stop : data.coordinates.start;
    this.labelPos = config.labelPosition || config.position;
    this.padding = config.labelPadding || 0;
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    this.show = this.data.isLandmark;
    tmpCtx.font = `${config.labelSize}px ${config.labelFace}`;
    this.width = tmpCtx.measureText(data.name).width + this.padding;
    if(this.width > this.parent.trackMaxWidth){this.parent.trackMaxWidth = this.width;}
    this.bounds = new Bounds({
      top:  y1 - (config.labelSize/2) ,
      bottom: y1 + (config.labelSize/2),
      left: 0,
      width: 0,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */
  updateBounds(){
    let y = translateScale(this.position, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    let height = this.config.labelSize;
    const width = this.bounds.width;
    if(width === 0) {  // only need to do new bounds once as fully replacing takes longer than shifting.
      this.bounds = new Bounds({
        top: y - (height / 2),
        bottom: y + (height / 2),
        left: this.labelPos >= 0 ? this.padding : this.parent.trackMaxWidth - this.width,
        width: this.width,
        allowSubpixel: false
      });
    }
    this.bounds.translate(0, ((y+height/2)-this.bounds.bottom));
  }

  draw(ctx) {
    if(this.position < this.view.visible.start || this.position > this.view.visible.stop){ // don't draw if out of view
      return;
    }
    let config = this.config;
    ctx.font = `${config.labelSize}px ${config.labelFace}`;
    this.updateBounds();
    if(!this.show) return;

    let gb = this.canvasBounds || {};
    ctx.save();
    ctx.translate(gb.left, gb.bottom);
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.fillText(this.data.name,0, 0);
    ctx.restore();
    // reset bounding box to fit the new stroke location/width
    this.show = this.data.isLandmark;
  }
}
