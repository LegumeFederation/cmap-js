/**
 * QTL - A feature with a length and width drawn as part of a group of similar
 * features
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class manhattanRuler extends SceneGraphNodeBase {

  /**
   * Construct the QTL feature
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param initialConfig - configuration object for display variables
   */

  constructor({parent, featureModel,config}) {
    super({parent});
    this.config = config;
    this.manhattanPlot = featureModel;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top:0,
      left:0,
      width: config.displayWidth,
      height: this.parent.bounds.height
    });
  }

  /**
   *
   * @param ctx
   */

  draw(ctx) {
    let config = this.config;
    ctx.save();
    ctx.globalAlpha = .5;
    let cb = this.globalBounds;
    let depth = 0;
    if (this.manhattanPlot) {
      //Draw "ruler"
      ctx.strokeStyle = config.rulerColor;
      ctx.lineWidth = config.rulerWeight;

      //Baseline marks
      ctx.beginPath();

      ctx.moveTo(cb.left, cb.top);
      ctx.lineTo(cb.right, cb.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cb.left, cb.bottom);
      ctx.lineTo(cb.right, cb.bottom);
      ctx.stroke();

      //Ruler
      for (let i = 0; i <= this.manhattanPlot.view.stop; i++) {
        if (i % config.rulerMinorMark === 0 || i % config.rulerMajorMark === 0) {
          depth = translateScale(i, {
            start: 0,
            stop: config.displayWidth
          }, this.manhattanPlot.view, false);
          ctx.beginPath();
          ctx.moveTo(cb.left + depth, cb.top);
          ctx.lineTo(cb.left + depth, cb.top - 10);
          ctx.stroke();
          if (i % config.rulerMajorMark === 0) {
            ctx.font = config.labelSize;
            ctx.fillStyle = config.labelColor;
            ctx.textAlign = 'center';
            ctx.fillText(String(i), cb.left + depth, cb.top - 11);
          }
        }
      }
      ctx.fillText('-log10(p)', cb.left + config.displayWidth / 2, cb.top - 25);

      // Reference lines

      if (this.manhattanPlot.lines) {
        this.manhattanPlot.lines.forEach(line => {
          depth = translateScale(line.value, {
            start: 0,
            stop: config.displayWidth
          }, this.manhattanPlot.view, false);
          ctx.strokeStyle = line.lineColor;
          ctx.lineWidth = line.lineWeight;
          ctx.beginPath();
          ctx.moveTo(cb.left + depth, cb.top);
          ctx.lineTo(cb.left + depth, cb.bottom);
          ctx.stroke();
        });
      }
    }
    ctx.restore();

    this.children.forEach(child => child.draw(ctx));
  }
}
