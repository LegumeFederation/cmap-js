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

  constructor({parent, data, config}) {
    super({parent, tags: [data.name]});
    this.config = config;
    this.labelPos = config.labelPosition || config.position;
    this.data = data;
    this.position = this.invert ? this.data.coordinates.start : this.data.coordinates.stop;
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    let padding = 2;
    let width = config.labelSize + padding ;
    this.offset = this.labelPos >= 0 ? 0 : padding;
    let left = this.labelPos >= 0 ? this.fm.bounds.right  : this.fm.bounds.left-width;
    this.show = false;

    this.bounds = new Bounds({
      top: y1,
      left: left,
      width: width,
      height: -this.config.labelSize * this.data.name.length/2,
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
    let y1 = translateScale(this.position, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    this.bounds.top = y1;
    this.bounds.height = -ctx.measureText(this.data.name).width;
    if(!this.show) return; // return here, because it's still good to make sure that the label width is known
    let gb = this.canvasBounds || {};
    ctx.save();
    ctx.translate(gb.right, gb.top);
    ctx.textAlign = 'left';
    ctx.fillStyle = config.labelColor;
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.data.name, 0, -this.offset); // config.labelSize-2);
    ctx.restore();
    this.show = false; // reset show for next draw cycle
  }
}
