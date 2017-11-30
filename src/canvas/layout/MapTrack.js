/**
  * MapTrack
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import knn from 'rbush-knn';

import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {Bounds} from '../../model/Bounds';
import {FeatureMark} from '../geometry/FeatureMark';
import {MapBackbone} from '../geometry/MapBackbone';
import {FeatureLabel} from '../geometry/FeatureLabel';

export class  MapTrack extends SceneGraphNodeTrack {

  constructor(params) {
    console.log("MapTrack-> Constructing Map");
    super(params);
    const b = this.parent.bounds;
    this.model = this.parent.model;
    //const backboneWidth = b.width * 0.2;
    const backboneWidth =  this.model.config.backboneWidth;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: backboneWidth,
      height: b.height
    });
    this.mC = this.parent.mapCoordinates;
    this.backbone = new MapBackbone({ parent: this, bioMap: this.model});	
    this.addChild(this.backbone);

    // calculate scale factor between backbone coordinates in pixels
    this.model.view.pixelScaleFactor = this.backbone.bounds.height/this.model.length;
    this.model.view.backbone = this.globalBounds;

    // Setup groups for markers and labels
    let markerGroup = new SceneGraphNodeGroup({parent:this});
    this.addChild(markerGroup);
    this.markerGroup = markerGroup;
    markerGroup.bounds = this.backbone.bounds;
    this.addChild(markerGroup);
    let labelGroup = new SceneGraphNodeGroup({parent:this});
    this.addChild(labelGroup);
    this.labelGroup = labelGroup;
    labelGroup.bounds = new Bounds({
      top: 0,
      left: this.backbone.bounds.right + 1,
      height: this.bounds.height,
      width: 0 
    });

    // Filter features for drawing
    this.filteredFeatures = this.model.features.filter( model => {
      return model.length <= 0.00001;
    });

    //Place features and their labels, prepare to add to rtree
    let fmData = [];
    let lmData = [];
    console.log('lgb',this.labelGroup.bounds.right);
    this.featureMarks = this.filteredFeatures.map( model => {
      let fm = new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: this.model
      });

      let lm = new FeatureLabel({
        featureModel: model,
        parent: this.labelGroup,
        bioMap: this.parent.model
      });
      markerGroup.addChild(fm);
      labelGroup.addChild(lm);
      fmData.push({
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data:fm
      });
      lmData.push({
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: lm.globalBounds.left,
        maxX: lm.globalBounds.left + this.labelGroup.bounds.width,
        data: lm
      });
      if(lm.bounds.right > this.labelGroup.bounds.right) this.labelGroup.bounds.right = lm.bounds.right;
      return fm;
    });
    console.log('lgb post',this.labelGroup.bounds.right);

    // Load group rtrees for markers and labels
    markerGroup.locMap.load(fmData);
    labelGroup.locMap.load(lmData);
    // load this rtree with markers (elements that need hit detection)
    this.locMap.load(fmData);
  }

  get visible(){
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
    let labels = [];
    let start = visc.start;
    let stop = visc.stop;
		let psf = this.labelGroup.children[0].pixelScaleFactor;
    let step =((visc.start*(coord.stop*psf - 12) +	visc.stop*(12 - coord.start* psf))/(psf*(coord.stop - coord.start)) - start) - (coord.start*-1);
    for(let i = start; i < stop; i+=step){
     
     let item =  knn( this.labelGroup.locMap, this.labelGroup.children[0].globalBounds.left,i,1)[0];
     if(labels.length === 0){
       labels.push(item);
       continue;
     }
     let last = labels[labels.length-1];
     if(item != last && (item.minY > (last.maxY + step))){
       labels.push(item);
     }
    }
    vis = vis.concat(labels);
    //vis = vis.concat([{data:this}]);
    return vis;
  }

  get hitMap(){
    let bbGb = this.backbone.globalBounds;
    return this.markerGroup.children.map( child =>{
      return {
        minY: child.globalBounds.bottom+1,
        maxY: child.globalBounds.top-1,
        minX: bbGb.left ,
        maxX: bbGb.right ,
        data: child
      };
    });
  }

  draw(ctx){
    let gb = this.globalBounds || {};
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );   
    ctx.fillStyle = 'green';
    gb = this.labelGroup.globalBounds || {};
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );   
  }

  loadLabelMap(){
  }
}
