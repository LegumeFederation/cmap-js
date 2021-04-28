/**
 * FeatureMarker
 * A SceneGraphNode representing a feature on a Map with a line or hash mark.
 *
 * @extends SceneGraphNodeBase
 */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';
import {SceneGraphNodeFeature} from '../node/SceneGraphNodeFeature';

export class FeatureMark extends SceneGraphNodeFeature {

  /**
   * Constructor
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   */

  constructor({parent:parent, data:data, config: config}) {
    super({parent, tags: [data.name]});
    this.model = data;
    this.config = config;
    this.start = this.model.coordinates.start;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: parent.bounds.width,
      height: config.lineWeight,
    });
  }

  /**
   * Draw the marker
   * @param ctx - active canvas2D context
   */

  draw(ctx) {
    if(this.start < this.view.visible.start || this.start > this.view.visible.stop){ // don't draw if out of view
      return;
    }
    let config = this.config;
    let y = translateScale(this.start, this.view.base, this.view.visible, this.view.invert) * this.view.pixelScaleFactor;
    this.bounds.translate(0,y-this.bounds.top);
    let gb = this.canvasBounds || {};
    ctx.beginPath();
    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = config.lineWeight;
    // noinspection JSSuspiciousNameCombination
    ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
    // noinspection JSSuspiciousNameCombination
    ctx.lineTo(Math.floor(gb.right), Math.floor(gb.top));
    ctx.stroke();
    // reset bounding box to fit the new stroke location/width
    // lineWidth adds equal percent of passed width above and below path
    //this.bounds.translate(0,-config.lineWeight/2);
  }
}
