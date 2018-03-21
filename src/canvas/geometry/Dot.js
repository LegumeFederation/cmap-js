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
    //setup config
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

    // setup initial placement
    if(this.model.coordinates.depth) {
      this.depth = translateScale(this.model.coordinates.depth, {
        start: 0,
        stop: bioMap.manhattanPlot.width
      }, bioMap.manhattanPlot.view, false);
    }
    this.bounds = new Bounds({
      top: 0,
      left: 0,
      width: 2*this.radius, //this.fontSize*(this.model.name.length),
      height: 2*this.radius,
      allowSubpixel: false
    });
  }

  /**
   * Draw label on cmap canvas context
   * @param ctx
   */

  draw(ctx) {
    //Setup a base offset based on parent track
    if( !this.offset){
      const left = this.globalBounds.left;
      const top = this.globalBounds.top;
      this.offset = {top: top, left:left};
    }
    let y = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let x = this.depth;

    // Draw dot
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x+this.offset.left, y+this.offset.top, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    //update bounding box
    this.bounds.top = y-this.radius;
    this.bounds.left = x - this.radius;
    this.bounds.width = 2*this.radius;
    this.bounds.height = 2*this.radius;
  }
}