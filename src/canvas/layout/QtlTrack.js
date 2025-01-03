/**
 * QtlTrack
 * A SceneGraphNode representing a collection of QTLs.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack.js';
import {Bounds} from '../../model/Bounds.js';
import {QTL} from '../geometry/QTL.js';
import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup.js';
import * as trackSelector  from './TrackSelector.js';

export class QtlTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group of QTL rectangles
   * @param params
   */

  /**
   * TODO: Allow for subtracks
   */

  constructor(params) {
    super(params);
    this.filteredFeatures = [];
    let b = this.parent.bounds;
    const order = this.parent.children.length;
    let left = order > 0 ? this.parent.children[this.parent.children.length - 1].bounds.right : 0;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: left,
      width: this.parent.model.config.qtl.trackMinWidth,
      height: b.height
    });

    let qtlConf = params.config;
    for (let key in this.parent.model.config.qtl) {
      if (!Object.prototype.hasOwnProperty.call(qtlConf, key)) {
        qtlConf[key] = this.parent.model.config.qtl[key];
      }
    }
    let filteredFeatures = [];
    qtlConf.filters.forEach((filter, order) => {
      let test = this.parent.model.features.filter(model => {
        return model.tags[0].match(filter) !== null;
      });
      if (test.length === 0) {
        // get rid of any tags that don't actually get used
        qtlConf.filters.splice(order, 1);
      } else {
        filteredFeatures = filteredFeatures.concat(test);
      }
    });

    filteredFeatures = filteredFeatures.sort((a, b) => {
      return a.coordinates.start - b.coordinates.start;
    });
    let fmData = [];

    let featureGroup = new SceneGraphNodeGroup({parent: this});

    featureGroup.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: 100,
      height: this.bounds.height
    });

    this.maxLoc = 0;
    let featureData = filteredFeatures.map(model => {
      let fm = new QTL({
        featureModel: model,
        parent: featureGroup,
        bioMap: this.parent.model,
        initialConfig: qtlConf,
        config: this.parent.model.config.qtl
      });
      featureGroup.addChild(fm);

      let loc = {
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data: fm
      };

      featureGroup.locMap.insert(loc);
      this.locMap.insert(loc);

      fmData.push(loc);

      if (fm.globalBounds.right > this.globalBounds.right) {
        this.bounds.right = fm.globalBounds.right - this.globalBounds.left;
        featureGroup.bounds.right = fm.globalBounds.right - this.globalBounds.left;
        this.parent.bounds.right += fm.globalBounds.right - this.parent.globalBounds.right;
      }

      return fm;
    });
    this.featureData = featureData;
    this.addChild(featureGroup);
    this.featureGroup = featureGroup;
    this.model = this.parent.model;
    this.labelGroup = trackSelector.label({parent: this, config: params.config});
    this.parent.labels = this.labelGroup;
    if (this.labelGroup) { // chances are the label group is going to break the parent's bounds, so move things as needed.

      this.addChild(this.parent.labels);
      let offset = this.labelGroup.offset || 0;
      if(offset < 0) {
        offset = -offset;
        this.featureGroup.bounds.left += offset;
        this.labelGroup.bounds.left += offset;
      }
        this.featureGroup.bounds.right += offset;
        this.labelGroup.bounds.right += offset;
        this.parent.bounds.right += offset;//(this0.parent.globalBounds.right-featureGroup.globalBounds.right);
        this.bounds.right += offset;
    }
    this.locMap.clear();
    this.locMap.load(fmData);
  }

  /**
   *
   */

  get visible() {
    // let visible = [];
    // this.children.forEach(child => {
    //   visible = visible.concat(child.locMap.all());
    // });
    //
    // return visible;
    return this.locMap.all();
    // return this.locMap.all().concat([{data:this}]); // debugging statement to test track width bounds
  }

  /**
   * Debug draw to check track positioning
   * @param ctx
   */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = '#ADD8E6';
    this.children.forEach(child => {
      let cb = child.globalBounds;
      // noinspection JSSuspiciousNameCombination
      // noinspection JSSuspiciousNameCombination
      ctx.fillRect(
        Math.floor(cb.left),
        Math.floor(cb.top),
        Math.floor(cb.width),
        Math.floor(cb.height)
      );
    });
    ctx.restore();
  }

  /**
   * Get RTree children that are visible in the canvas' current zoom bounds
   * @returns {Array}
   */

  get hitMap() {
    //return this.locMap.all();
    return this.featureGroup.children.map(child => {
      return {
        minY: child.globalBounds.top,
        maxY: child.globalBounds.bottom,
        minX: child.globalBounds.left,
        maxX: child.globalBounds.right,
        data: child
      };
    });
  }
}
