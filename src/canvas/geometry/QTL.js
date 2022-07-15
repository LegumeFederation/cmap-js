/**
 * QTL - A feature with a length and width drawn as part of a group of similar
 * features
 *
 * @extends SceneGraphNodeBase
 */

import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class QTL extends SceneGraphNodeBase {

  /**
   * Construct the QTL feature
   * @param parent - parent scene graph node
   * @param bioMap - map data
   * @param featureModel - feature data
   * @param initialConfig - configuration object for display variables
   */

  constructor({parent, bioMap, featureModel, initialConfig,config}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.featureMap = bioMap;
    this.view = this.featureMap.view;
    this.lineWidth = 1.0;
    //min and max location in pixels
    this.pixelScaleFactor = this.featureMap.view.pixelScaleFactor;
    this.fill = config.fillColor;
    if(initialConfig.fillColor) {
      this.fill = initialConfig.fillColor[initialConfig.filters.indexOf(this.model.tags[0])] || initialConfig.fillColor[0];
    }

    this.width = initialConfig.width || config.width;
    this.trackSpacing = initialConfig.internalPadding || config.internalPadding;
    this.offset = this.trackSpacing;
    this.invert = this.view.invert;
    this.start = this.invert ? this.model.coordinates.stop : this.model.coordinates.start;
    this.stop = this.invert ? this.model.coordinates.start : this.model.coordinates.stop;

    if(initialConfig.labelStyle !== 'none') {
      this.labelColor = initialConfig.labelColor || config.labelColor;
      this.labelSize = initialConfig.labelSize || config.labelSize;
      this.labelFace = initialConfig.labelFace || config.labelFace;
      if(initialConfig.labelStyle === 'feature') this.offset += this.labelSize;
    }

    // Calculate start/end position, then
    // Iterate across QTLs in group and try to place QTL region where it can
    // minimize stack width in parent group 
    let y1 = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let y2 = translateScale(this.stop, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let leftLoc = 0;
    let leftArr;
    leftArr = this.parent.locMap.search({
      minY: this.model.coordinates.start,
      maxY: this.model.coordinates.stop,
      minX: 0,
      maxX: 10000
    });
    leftArr = leftArr.sort((a, b) => {
      return a.data.bounds.right - b.data.bounds.right;
    });
    let stepOffset = this.width + this.offset;
    let stackEnd = leftArr.length;
    for (let i = 0; i <= stackEnd; ++i) {
      leftLoc = i * (stepOffset);
      if (leftArr[i] && leftArr[i].data.bounds.left !== leftLoc) {
        break;
      }
    }

    this.bounds = new Bounds({
      allowSubpixel: false,
      top: y1,
      left: leftLoc,
      width: this.width,
      height: y2 - y1
    });
  }

  /**
   *
   * @param ctx
   */

  draw(ctx) {
    // Get start and stop of QTL on current region, if it isn't located in
    // current view, don't draw, else cutoff when it gets to end of currently
    // visible region.
    if (this.model.coordinates.stop < this.view.visible.start ||
      this.model.coordinates.start > this.view.visible.stop) return;
    let y1pos = this.model.coordinates.start > this.view.visible.start ? this.model.coordinates.start : this.view.visible.start;
    let y2pos = this.model.coordinates.stop < this.view.visible.stop ? this.model.coordinates.stop : this.view.visible.stop;
    this.start = y1pos;
    this.stop = y2pos;
    if (this.invert) {
      this.start = y2pos;
      this.stop = y1pos;
    }

    let y1 = translateScale(this.start, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;
    let y2 = translateScale(this.stop, this.view.base, this.view.visible, this.invert) * this.pixelScaleFactor;

    //setup bounds and draw
    this.bounds = new Bounds({
      top: y1,
      height: y2 - y1,
      left: this.bounds.left,
      width: this.width
    });
    let gb = this.globalBounds || {};
    let qtlHeight = gb.height > 1 ? gb.height : 1;
    ctx.fillStyle = this.fill;
    // noinspection JSSuspiciousNameCombination
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(this.width),
      Math.floor(qtlHeight)
    );

    // Draw any children
    this.children.forEach(child => child.draw(ctx));
  }
}
