/**
 * FeatureMarker
 * A SceneGraphNode representing a feature on a Map with a line or hash mark.
 *
 * @extends SceneGraphNodeBase
 */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class FeatureMark extends SceneGraphNodeBase {

  /**
   * Constructor
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   */

  constructor({parent, bioMap, featureModel,config}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.featureMap = bioMap;
    this.config = config;

    this.offset = this.featureMap.view.base.start * -1;
    this.invert = this.featureMap.view.invert;
    this.start = this.model.coordinates.start;
    this.pixelScaleFactor = this.featureMap.view.pixelScaleFactor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: parent.bounds.width,
      height: config.lineWeight
    });
  }

  /**
   * Draw the marker
   * @param ctx - active canvas2D context
   */

  draw(ctx) {
    let config = this.config;
    let y = translateScale(this.start, this.featureMap.view.base, this.featureMap.view.visible, this.invert) * this.pixelScaleFactor;
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
