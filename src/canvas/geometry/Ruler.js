/**
 * ruler
 * A SceneGraphNode representing ruler and zoom position for a given backbone
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class Ruler extends SceneGraphNodeBase {

  /**
   * Constructor
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param config - ruler configuration object
   */

  constructor({parent:parent, config: config}) {
    super({parent: parent});
    this.config = config;
    this.offset = this.view.base.start * -1;
    this.invert = this.view.invert;
    this.fillColor = config.fillColor;
    this.textFace = config.labelFace;
    this.textSize = config.labelSize;
    this.textColor = config.labelColor;
    this.rulerPrecision = config.precision;
    this.rulerWidth = config.width;
    this.rulerPadding = config.padding;
    this.innerSize = config.innerLineWeight;
    this.innerColor = config.innerLineColor;
    this.layout();
  }

  layout(){
    const b = this.parent.namedChildren['features'].bounds;
    let leftloc;
    let config = this.config;
    if (config.position < 0){
      leftloc = b.left - config.width - config.padding - config.lineWeight; //arbitrary spacing to look goo
    } else {
      leftloc = b.right + config.width + config.padding + config.lineWeight; //arbitrary spacing to look goo
    }
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: this.bounds ? this.bounds.left : leftloc, //arbitrary spacing to look goo
      width: this.bounds ? this.bounds.width : config.width,
      height: b.height
    });
  }

  /**
   * Draw ruler and zoom bar
   * @param ctx - linked canvas2D context
   */

  draw(ctx) {
    let config = this.config;
    let vStart = this.invert ? this.view.visible.stop : this.view.visible.start;
    let vStop = this.invert ? this.view.visible.start : this.view.visible.stop;
    let start = translateScale(vStart, this.view.base, this.view.base, this.invert) * this.view.pixelScaleFactor;
    let stop = translateScale(vStop, this.view.base, this.view.base, this.invert) * this.view.pixelScaleFactor;
    let text;

    if( config.side === 'left' ) {
      text =[this.view.base.start.toFixed(config.precision), this.view.base.stop.toFixed(config.precision)];
    } else {
      text = [this.view.visible.start.toFixed(config.precision), this.view.visible.stop.toFixed(config.precision)];
    }
    this.textWidth = ctx.measureText(text[0]).width > ctx.measureText(text[1]).width ? ctx.measureText(text[0]).width : ctx.measureText(text[1]).width;

    let gb = this.canvasBounds || {};

    // draw baseline labels
    ctx.font = `${config.labelSize}px ${config.labelFace}`;
    ctx.fillStyle = config.labelColor;
    ctx.textAlign = 'left';
    if (this.invert) {
      ctx.fillText(text[1], gb.left - ctx.measureText(text[1]).width - (gb.width / 2), Math.floor(gb.top - config.labelSize*.75));
      ctx.fillText(text[0], gb.left - ctx.measureText(text[0]).width - (gb.width / 2), Math.floor(gb.bottom + config.labelSize + 5));
    } else {
      ctx.fillText(text[0], gb.left - ctx.measureText(text[0]).width - (gb.width / 2), Math.floor(gb.top - config.labelSize*.75));
      ctx.fillText(text[1], gb.left - ctx.measureText(text[1]).width - (gb.width / 2), Math.floor(gb.bottom + (config.labelSize*1.5)));
    }

    // Draw zoom position labels
    if( config.side === 'left' ) {
      text = [this.view.visible.start.toFixed(config.precision), this.view.visible.stop.toFixed(config.precision)];
    } else {
      text =[this.view.base.start.toFixed(config.precision), this.view.base.stop.toFixed(config.precision)];
    }
    if (this.invert) {
      ctx.fillText(text[1], gb.left + config.width + config.padding, Math.floor(gb.top - config.labelSize*.75));
      ctx.fillText(text[0], gb.left + config.width + config.padding, (gb.bottom + config.labelSize + 5));
    } else {
      ctx.fillText(text[0], gb.left + config.width + config.padding, Math.floor(gb.top - config.labelSize*.75));
      ctx.fillText(text[1], gb.left + config.width + config.padding, (gb.bottom + (config.labelSize*1.5)));
    }

    //Draw baseline ruler
    ctx.beginPath();
    ctx.lineWidth = config.innerLineWeight;
    ctx.strokeStyle = config.innerLineColor;
    // noinspection JSSuspiciousNameCombination
    ctx.moveTo(Math.floor(gb.left + gb.width / 2), Math.floor(gb.top));
    // noinspection JSSuspiciousNameCombination
    ctx.lineTo(Math.floor(gb.left + gb.width / 2), Math.floor(gb.bottom));
    ctx.stroke();

    // Draw "zoom box"
    ctx.fillStyle = config.fillColor;//'aqua';
    let height = stop - start > 1 ? stop - start : 1.0;
    // noinspection JSSuspiciousNameCombination
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(start + gb.top),
      Math.floor(gb.width),
      Math.floor(height)
    );
    //draw border if asked for
    if(config.lineWeight > 0) {
      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = config.lineWeight;
      ctx.strokeRect(
        Math.floor(gb.left),
        Math.floor(start + gb.top),
        Math.floor(gb.width),
        Math.floor(height)
      );
    }
    ////debugging rectangle to test group bounds
    //ctx.fillStyle = 'red';
    //ctx.fillRect(
    //  Math.floor(gb.left),
    //  Math.floor(gb.top),
    //  Math.floor(gb.width),
    //  Math.floor(gb.height)
    //);

    this.children.forEach(child => child.draw(ctx));
  }

  /**
   * Return the ruler as data for an scenegraph visibility check. (Ruler by definition is
   * always visible, and does own logic for the position bar)
   * @returns {{data: Ruler}}
   */

  get visible() {
    return {data: this};
  }
}
