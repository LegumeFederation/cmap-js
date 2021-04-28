/**
 * QtlTrack
 * A SceneGraphNode representing a collection of QTLs.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {Bounds} from '../../model/Bounds';
import {QTL} from '../geometry/QTL';
import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {label} from './LabelSelector';
//import * as trackSelector  from './TrackSelector';

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
    this.config = params.config;
    this.model = params.model;
    const order = this.parent.children.length;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width:  this.config.trackMinWidth,
      height: b.height

    });

    let filteredFeatures = [];
    this.config.filters.forEach((filter) => {
       filteredFeatures = filteredFeatures.concat(this.model.taggedFeatures[filter]);
    });
    filteredFeatures.sort((a, b) => {
      return a.coordinates.start - b.coordinates.start;
    });

    let fmData = [];

    let featureGroup = new SceneGraphNodeGroup({parent: this});
    this.addChild(featureGroup,'features');
    featureGroup.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: 100,
      height: this.bounds.height
    });

    this.maxLoc = 0;
    filteredFeatures.map(model => {
      let fm = new QTL({
        featureModel: model,
        parent: featureGroup,
        bioMap: this.parent.model,
        initialConfig: this.config,
        config: this.config
      });
      featureGroup.addChild(fm);

      let loc = {
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: this.canvasBounds.left,
        maxX: this.canvasBounds.right,
        data: fm
      };
      let hits = this.locMap.search(loc);
      if(hits.length){
        hits.sort((a,b)=>{return a.maxX + b.maxX;});
        fm.bounds.translate(hits[0].maxX-loc.minX + this.config.padding,0);
      }

      loc.minX = fm.canvasBounds.left;
      loc.maxX = fm.canvasBounds.right;
      this.locMap.insert(loc);
      if (fm.canvasBounds.right > this.canvasBounds.right) {
        this.bounds.right = fm.canvasBounds.right - this.canvasBounds.left;
        featureGroup.bounds.right = fm.canvasBounds.right - this.canvasBounds.left;
        this.parent.bounds.right += fm.canvasBounds.right - this.parent.canvasBounds.right;
      }
      fmData.push(loc);
    });
    this.locMap.clear();
    this.locMap.load(fmData);
    let labelGroup =  undefined;
    if(this.config.labelStyle !== '' || this.config.labelStyle !== 'none') {
      labelGroup = label({parent: this, config: this.config, data: this.locMap.all()});
      this.addChild(labelGroup, 'labels');
    }


      this.parent.updateWidth(this.canvasBounds.right+this.parent.config.track.padding);
      //TODO: fix labels

  }

  /**
   *
   */

  get visible() {
     let visible = this.locMap.all();
     if(this.namedChildren['labels']){
       visible = visible.concat(this.namedChildren['labels'].visible);
     }
   //  this.children.forEach(child => {
   //    visible = visible.concat(child.locMap.all());
   //  });
   // //
   // // return visible;
   return visible;
    // return this.locMap.all().concat([{data:this}]); // debugging statement to test track width bounds
  }

  /**
   * Debug draw to check track positioning
   * @param ctx
   */

  draw(ctx) {
    //ctx.save();
    //ctx.globalAlpha = .5;
    //ctx.fillStyle = '#ADD8E6';
    //this.children.forEach(child => {
    //  let cb = child.canvasBounds;
    //  // noinspection JSSuspiciousNameCombination
    //  // noinspection JSSuspiciousNameCombination
    //  ctx.fillRect(
    //    Math.floor(cb.left),
    //    Math.floor(cb.top),
    //    Math.floor(cb.width),
    //    Math.floor(cb.height)
    //  );
    //});
    //ctx.restore();
  }

  /**
   * Get RTree children that are visible in the canvas' current zoom bounds
   * @returns {Array}
   */

  get hitMap() {
    //return this.locMap.all();
    return this.featureGroup.children.map(child => {
      return {
        minY: child.canvasBounds.top,
        maxY: child.canvasBounds.bottom,
        minX: child.canvasBounds.left,
        maxX: child.canvasBounds.right,
        data: child
      };
    });
  }
}
