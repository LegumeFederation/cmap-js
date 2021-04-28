/**
 * MapTrack
 * A SceneGraphNode representing a backbone, simply a rectangle representing
 * the background.
 */

//import knn from 'rbush-knn';
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {Bounds} from '../../model/Bounds';
import {Ruler} from '../geometry/Ruler';
import {FeatureMark} from '../geometry/FeatureMark';
import {MapBackbone} from '../geometry/MapBackbone';
import {SceneGraphNodeOverlay} from '../node/SceneGraphNodeOverlay';
import {label} from './LabelSelector';
import RBush from 'rbush';

export class MapTrack extends SceneGraphNodeTrack {

  /**
   *
   * @param params
   */

  constructor(params){
    super(params);
    this.config = this.parent.config;
    this.locMap = new RBush();

    this.layout();
    //this.mC = this.parent.mapCoordinates;
    this.backbone = new MapBackbone({parent: this, data: this.parent.data, config: this.config.backbone});
    this.addChild(this.backbone,'features');
    this.parent.updatePSF(this.backbone.bounds.height / this.parent.data.length);

   // Setup groups for markers and labels
    let markerGroup = new SceneGraphNodeOverlay({parent: this.backbone});
    this.backbone.addChild(markerGroup, 'markers');

    // Filter features for drawing, if there is an array of tags to filter, use them, otherwise
    let landmarkGroup = new SceneGraphNodeOverlay({parent: this.backbone});
    this.backbone.addChild(markerGroup, 'landmarks');

    // use length of individual models.
    let filterArr = this.config.marker.filter;
    if(filterArr.length > 0) {
      this.filteredData = this.parent.data.filter(model => {
        return filterArr.some(tag => {
          return model.tags.indexOf(tag) !== -1;
        });
      });
    } else {
      this.filteredData = this.parent.data.filter(model => {
        return model.length <= 0.00001;
      });
    }

    //Place features and their labels, prepare to add to rtree
    let fmData = [];
    this.filteredData.forEach(model => {
      const fm = new FeatureMark({
        parent: markerGroup,
        data: model,
        config: this.config.marker
      });
      if (model.isLandmark) {
        landmarkGroup.addChild(fm);
      } else {
        markerGroup.addChild(fm);
      }
      fmData.push({
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: this.bounds.left,
        maxX: this.bounds.right,
        data: fm,
      });
    });

    // Load group rTrees for markers and labels
    //markerGroup.locMap.load(fmData);
    //labelGroup.locMap.load(lmData);
    this.featureData = markerGroup.children;
    this.featureGroup = markerGroup;
    this._addLabels();
    this._addRuler();
    let labels = this.namedChildren['labels'];
    if(labels.offset){ // offset == 1 to draw on rhs of backbone
      labels.bounds.translate(this.backbone.bounds.right + 3 ,0);
      this.updateWidth(labels.bounds.right);
    } else {
      labels.bounds.translate(this.ruler.bounds.right + this.ruler.config.padding, 0);
      this.backbone.translate((labels.bounds.right-this.backbone.bounds.left) + 3,0);
      this.updateWidth(this.backbone.bounds.right);
    }
    this.bounds.translate((this.parent.bounds.width/2) - (this.bounds.width/2),0);

    // load this rtree with markers (elements that need hit detection)
   this.locMap.load(fmData);
   this.updateLocMap();
  }

  layout() {
    const backboneWidth = this.parent.bounds.width * 0.2;
    //const backboneWidth = 400;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: this.bounds && this.bounds.left ? this.bounds.left : 0,
      bottom: this.parent.bounds.height - this.parent.bounds.top-20,
      width: this.bounds && this.bounds.width ? this.bounds.width: backboneWidth,
    });

    // calculate scale factor between backbone coordinates in pixels
    this.parent.updatePSF(this.bounds.height / (this.view.base.stop - this.view.base.start));

    // default layout() logic
    this.children.forEach(child => child.layout());
    if(this.parent && this.canvasBounds.right > this.parent.canvasBounds.right){
      this.updateWidth(this.canvasBounds.right);
    }
  }

  updateLocMap() {
    const updated =  this.locMap.all().map(child => {
      return {
        maxY: child.data.start,
        minY: child.data.start,
        minX: child.data.canvasBounds.left,
        maxX: child.data.canvasBounds.right,
        data: child.data
      };
    });
    this.locMap.clear();
    this.locMap.load(updated);
  }

  _addRuler(){
    let config = this.config;
    this.ruler = new Ruler({parent: this, config: config.ruler});
    this.addChild(this.ruler, 'ruler');
    if(this.labelGroup && ((config.ruler.position<0) === (config.marker.labelPosition<0)) ){
      const width = this.ruler.bounds.width;
      if(config.ruler.position >= 0) {
        this.ruler.bounds.translate(this.labelGroup.offset + width + config.ruler.padding - this.ruler.bounds.left , 0);
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
    let config = this.config;
   let labelGroup = label({parent: this, config:config.marker,data:this.featureData});
   this.addChild(labelGroup,'labels');
  }

  /**
   * Return all children visible within current viewport.
   * @returns {[{data: *|{width: number, padding: number, fillColor: string, lineWeight: number, lineColor: string, labelFace: string, labelSize: number, labelColor: string, innerLineWeight: number, innerLineColor: string, precision: number, steps: number, side: string}|{padding: number, innerLineColor: string, precision: number, lineColor: string, steps: number, labelColor: string, fillColor: string, labelFace: string, labelSize: number, innerLineWeight: number, lineWeight: number, width: number, position: number}}, {data: []|*}]|*}
   */
  get visible() {
    let vis = [{data:this.namedChildren.ruler},{data:this.namedChildren.features}];
    if(this.namedChildren['labels']) {
      return this.namedChildren.labels.visible.concat(vis);
    }

    return vis;
  }

  /**
   *
   * @param ctx
   */

  draw(ctx) {
   // for debugging purposes only
   //let gb = this.canvasBounds || {};
   //ctx.save();
   //ctx.globalAlpha = .5;
   //ctx.fillStyle = 'blue';
   //ctx.fillRect(
   //  Math.floor(gb.left),
   //  Math.floor(gb.top),
   //  Math.floor(gb.width),
   //  Math.floor(gb.height)
   //);
   //ctx.restore();
    this.visible.forEach(child => child.data.draw(ctx));
  }

  calculateHitmap(){
    let hits = [];
    hits = this.backbone.namedChildren['markers'].calculateHitmap();
    return hits;
  }
}

