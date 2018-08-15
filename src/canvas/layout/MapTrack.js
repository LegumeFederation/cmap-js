/**
 * MapTrack
 * A SceneGraphNode representing a backbone, simply a rectangle representing
 * the background.
 */

//import knn from 'rbush-knn';
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {Bounds} from '../../model/Bounds';
import {Ruler} from '../geometry/Ruler';
import {FeatureMark} from '../geometry/FeatureMark';
import {MapBackbone} from '../geometry/MapBackbone';
import * as trackSelector from './TrackSelector';


export class MapTrack extends SceneGraphNodeTrack {

  /**
   *
   * @param params
   */

  constructor(params) {
    console.log('MapTrack-> Constructing Map');
    super(params);
    const b = this.parent.bounds;
    this.model = this.parent.model;
    //const backboneWidth = b.width * 0.2;
    const backboneWidth = this.model.config.backbone.width;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: backboneWidth,
      height: b.height
    });
    this.mC = this.parent.mapCoordinates;
    this.backbone = new MapBackbone({parent: this, bioMap: this.model,config: this.model.config.backbone});
    this.addChild(this.backbone);

    // calculate scale factor between backbone coordinates in pixels
    this.model.view.pixelScaleFactor = this.backbone.bounds.height / this.model.length;
    this.model.view.backbone = this.globalBounds;

    // Setup groups for markers and labels
    let markerGroup = new SceneGraphNodeGroup({parent: this});
    this.addChild(markerGroup);
    this.markerGroup = markerGroup;
    markerGroup.bounds = this.backbone.bounds;
    this.addChild(markerGroup);
    // Filter features for drawing, if there is an array of tags to filter, use them, otherwise
    // use length of individual models.
    let filterArr = this.model.config.marker.filter;
    if(filterArr.length > 0) {
      this.filteredFeatures = this.model.features.filter(model => {
        return filterArr.some(tag => {
          return model.tags.indexOf(tag) !== -1;
        });
      });
    } else {
      this.filteredFeatures = this.model.features.filter(model => {
        return model.length <= 0.00001;
      });
    }

    //Place features and their labels, prepare to add to rtree
    let fmData = [];
    this.featureMarks = this.filteredFeatures.map(model => {
      let fm = new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: this.model,
        config: this.model.config.marker
      });

    //  let lm = new OldFeatureLabel({
    //    featureModel: model,
    //    parent: this.labelGroup,
    //    bioMap: this.parent.model,
    //    config: this.model.config.marker
    //  });
      markerGroup.addChild(fm);
    //  labelGroup.addChild(lm);
      fmData.push({
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data: fm
      });
     // lmData.push({
     //   minY: model.coordinates.start,
     //   maxY: model.coordinates.stop,
     //   minX: lm.globalBounds.left,
     //   maxX: lm.globalBounds.left + this.labelGroup.bounds.width,
     //   data: lm
     // });
     // if (lm.bounds.right > this.labelGroup.bounds.right) this.labelGroup.bounds.right = lm.bounds.right;
     // return fm;
    });

    // Load group rTrees for markers and labels
    markerGroup.locMap.load(fmData);
    //labelGroup.locMap.load(lmData);
    this.featureData = markerGroup.children;
    this.featureGroup = markerGroup;
    if(Math.abs(this.model.config.ruler.position) < Math.abs(this.model.config.marker.labelPosition)) {
      this._addRuler();
      this._addLabels();
    } else {
      this._addLabels();
      this._addRuler();
    }


    //this.ruler = new Ruler({parent: this, bioMap: this.model, config: this.model.config.ruler});
    //labelGroup.bounds = new Bounds({
    //  top: 0,
    //  left: this.backbone.bounds.right + 1,
    //  height: this.bounds.height,
    //  width: 0
    //});
    //// load this rtree with markers (elements that need hit detection)
    this.locMap.load(fmData);
  }


  _addRuler(){
    let config = this.model.config;
    this.ruler = new Ruler({parent: this, bioMap: this.model, config: config.ruler});
    //(reposition to outside the label group iff both are on the same side, and label group
    // has already been drawn
    if(this.labelGroup && ((config.ruler.position<0) === (config.marker.labelPosition<0)) ){
      const width = this.ruler.bounds.width;
      if(config.ruler.position >= 0) {
        this.ruler.bounds.left = (this.labelGroup.offset + width + config.ruler.padding);
        this.ruler.bounds.right = this.ruler.bounds.left + width;
        this.bounds.right += width + config.ruler.padding;
      } else {
        this.bounds.left +=  (width);
        this.featureGroup.bounds.left += width;
        this.ruler.bounds.right = 0;
        this.ruler.bounds.left = (this.ruler.bounds.right-width);
      }
    }
  }

  _addLabels(){
    let config = this.model.config;
    let offsetRuler = this.ruler && ((config.ruler.position<0) === (config.marker.labelPosition<0));
    if(offsetRuler){
      config.marker.labelPadding += 2*(config.ruler.padding+ Math.abs(this.ruler.bounds.width));
    }

    // set up track bounds to recognise labels
    this.labelGroup = trackSelector.label({parent: this, config:config.marker});
    ////this.addChild(labelGroup);
    let offset = this.labelGroup.offset || 0;
    if(offset < 0) {
      offset = -offset;
      this.featureGroup.bounds.left += offset;
      this.labelGroup.bounds.left += offset;
      this.featureGroup.bounds.right += offset;
      if(offsetRuler){
        this.ruler.bounds.left += offset;
        this.ruler.bounds.right += offset;
      }
    }
    this.labelGroup.bounds.right += offset;
    this.bounds.right += offset;

    // Move labels if the ruler is on same side and placed before labels



  }


  /**
   *
   * @returns {*[]}
   */


  get visible() {
    let coord = this.parent.model.view.base;
    let visc = this.parent.model.view.visible;

    let vis = [{
      minX: this.bounds.left,
      maxX: this.bounds.right,
      minY: coord.start,
      maxY: coord.stop,
      data: this.backbone
    }];
    vis = vis.concat(this.locMap.search({
      minX: this.bounds.left,
      maxX: this.bounds.right,
      minY: visc.start,
      maxY: visc.stop
    }));
  // vis = vis.concat([{data:this}]);
  //  let labels = [];
  //  let start = visc.start;
  //  let stop = visc.stop;
  //  let psf = this.labelGroup.children[0].pixelScaleFactor;
  //  let step = ((visc.start * (coord.stop * psf - 12) + visc.stop * (12 - coord.start * psf)) / (psf * (coord.stop - coord.start)) - start) - (coord.start * -1);
  //  for (let i = start; i < stop; i += step) {

  //    let item = knn(this.labelGroup.locMap, this.labelGroup.children[0].globalBounds.left, i, 1)[0];
  //    if (labels.length === 0) {
  //      labels.push(item);
  //      continue;
  //    }
  //    let last = labels[labels.length - 1];
  //    if (item !== last && (item.minY > (last.maxY + step))) {
  //      labels.push(item);
  //    }
  //  }
  //  vis = vis.concat(labels);
  //  return vis;
    //let visible = [];
    //this.labelGroup.forEach(child => {
    //  visible = visible.concat(child.visible);
    //  if(child.labels){
    //    visible = visible.concat(child.labels.visible);
    //  }
    //});
    if(this.labelGroup) {
      return this.labelGroup.visible.concat(vis);
    }
    return vis;
  }

  /**
   *
   */

  get hitMap() {
    let bbGb = this.backbone.globalBounds;
    return this.markerGroup.children.map(child => {
      return {
        minY: child.globalBounds.bottom + 1,
        maxY: child.globalBounds.top - 1,
        minX: bbGb.left,
        maxX: bbGb.right,
        data: child
      };
    });
  }

  /**
   *
   * @param ctx
   */

  draw(ctx) {
    let gb = this.globalBounds || {};
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = 'blue';
    // noinspection JSSuspiciousNameCombination
    // noinspection JSSuspiciousNameCombination
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
    ctx.fillStyle = 'green';
   // gb = this.labelGroup.globalBounds || {};
   // // noinspection JSSuspiciousNameCombination
   // // noinspection JSSuspiciousNameCombination
   // ctx.fillRect(
   //   Math.floor(gb.left),
   //   Math.floor(gb.top),
   //   Math.floor(gb.width),
   //   Math.floor(gb.height)
   // );
    ctx.restore();
  }

  loadLabelMap() {
  }
}
