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
    this.radius = 4;
    this.invert = bioMap.config.invert;
    this.start = this.model.coordinates.start;
    this.depth = translateScale(this.model.coordinates.depth, {start:0,stop:100},bioMap.manhattanPlot.view,false);
    console.log('manDepth', this.depth, this.model.coordinates.depth)
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    this.bounds = new Bounds({
      top: y,
      left: this.radius,
      width: 2*this.radius, //this.fontSize*(this.model.name.length),
      height: 12,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.globalBounds.left+this.depth,y , this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // reset bounding box to fit the new stroke location/width
    this.bounds.width = this.bounds.left + Math.floor(ctx.measureText(this.model.name).width) + 1;
    if (this.parent.bounds.width < this.bounds.width) this.parent.bounds.width = this.bounds.width;
  }
}