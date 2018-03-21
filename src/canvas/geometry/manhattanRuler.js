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

  constructor({parent, featureModel}) {
    super({parent});
    this.manhattanPlot = featureModel;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top:0,
      left:0,
      width: this.parent.width,
      height: this.parent.bounds.height
    });
  }

  /**
   *
   * @param ctx
   */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = 'green';
    let cb = this.globalBounds;
    let depth = 0;
    if (this.manhattanPlot) {
      //Draw "ruler"
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

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
        if (i % this.manhattanPlot.minorMark === 0 || i % this.manhattanPlot.majorMark === 0) {
          depth = translateScale(i, {
            start: 0,
            stop: this.manhattanPlot.width
          }, this.manhattanPlot.view, false);
          ctx.beginPath();
          ctx.moveTo(cb.left + depth, cb.top);
          ctx.lineTo(cb.left + depth, cb.top - 10);
          ctx.stroke();
          if (i % this.manhattanPlot.majorMark === 0) {
            ctx.font = '10px';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.fillText(String(i), cb.left + depth, cb.top - 11);
          }
        }
      }
      ctx.fillText('-log10(p)', cb.left + this.manhattanPlot.width / 2, cb.top - 25);

      // Reference lines

      if (this.manhattanPlot.lines) {
        this.manhattanPlot.lines.forEach(line => {
          depth = translateScale(line.value, {
            start: 0,
            stop: this.manhattanPlot.width
          }, this.manhattanPlot.view, false);
          ctx.strokeStyle = line.color;
          ctx.lineWidth = line.width;
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
