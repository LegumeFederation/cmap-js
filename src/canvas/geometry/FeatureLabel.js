/**
 *
 * A SceneGraphNode representing a text label for a feature on a Map.
 *
 * @extends SceneGraphNodeBase
 */

import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';
import {SceneGraphNodeFeature} from '../node/SceneGraphNodeFeature';

export class FeatureLabel extends SceneGraphNodeFeature {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param config - base configuration
   */

  constructor({parent:parent, data: data, config:config}) {
    super({parent, tags: [data.name]});
    this.config = config;
    this.labelPos = 1; //config.labelPosition || config.position;
    this.data = data;
    this.position = this.view.invert ? this.data.model.coordinates.start : this.data.model.coordinates.stop;
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    let padding = 2;
    let width = config.labelSize + padding ;
    this.offset = this.labelPos >= 0 ? 0 : padding;
    let left = this.labelPos >= 0 ? this.data.bounds.right  : this.data.bounds.left-width;
    this.show = true;

    this.bounds = new Bounds({
      top: 0,
      left: left,
      width: 10,
      height:  10, //-this.config.labelSize * this.data.model.name.length/2,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    if(this.position < this.view.visible.start || this.position > this.view.visible.stop){ // don't draw if out of view
      return;
    }
    let config = this.config;
    if(!config.labelSize) config.labelSize = 12;
    ctx.font = `${config.labelSize}px ${config.labelFace}`;
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    this.bounds.top = y1;
    this.bounds.height = -ctx.measureText(this.data.name).width;
 //   if(!this.show) return; // return here, because it's still good to make sure that the label width is known
    let gb = this.canvasBounds || {};
    ctx.save();
    ctx.translate(gb.right, gb.top);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black'; //config.labelColor;
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.data.model.name, 0, -this.offset); // config.labelSize-2);
    ctx.restore();
    //this.show = false; // reset show for next draw cycle
  }
}
