/**
 *
 * A SceneGraphNode representing a circular mark.
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class Dot extends SceneGraphNodeBase {
  /**
   * Constructor
   *
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   */

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.view = bioMap.view;
    this.fontSize = bioMap.config.markerLabelSize;
    this.fontFace = bioMap.config.markerLabelFace;
    this.color = 'green';
    this.pixelScaleFactor = this.view.pixelScaleFactor;
    this.radius = bioMap.manhattanPlot.displayRadius || 2;
    this.invert = bioMap.config.invert;
    this.start = this.model.coordinates.start;
    this.depth = 0;
    if(this.model.coordinates.depth) {
      this.depth = translateScale(this.model.coordinates.depth, {
        start: 0,
        stop: bioMap.manhattanPlot.width
      }, bioMap.manhattanPlot.view, false);
      console.log('man-ness',this.model.coordinates.depth, this.depth, bioMap.manhattanPlot.view.stop);
    }
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.bounds = new Bounds({
      top: 0,
      left: 0,
      width: 2*this.radius, //this.fontSize*(this.model.name.length),
      height: 2*this.radius,
      allowSubpixel: false
    });
    this.depth = this.depth + this.globalBounds.left;
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor + this.globalBounds.top;
    let x = this.depth + this.globalBounds.left;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
}