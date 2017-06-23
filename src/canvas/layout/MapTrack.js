/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import knn from 'rbush-knn';

import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import { Group } from '../node/SceneGraphNodeGroup';
import {Bounds} from '../../model/Bounds';
import {FeatureMark} from '../geometry/FeatureMark';
import {MapBackbone} from '../geometry/MapBackbone';
import {FeatureLabel} from '../geometry/FeatureLabel';

export class  MapTrack extends SceneGraphNodeTrack {

  constructor(params) {
    super(params);
    const b = this.parent.bounds;
    console.log('mapTrack',this.parent,b);
    let bioModel = this.parent.model;
    //const backboneWidth = b.width * 0.2;
    const backboneWidth =  60;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.top,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: b.height
    });
    this.mC = this.parent.mapCoordinates;
    console.log('loading backbone', this, bioModel);
    this.backbone = new MapBackbone({ parent: this, bioMap: bioModel});	
    this.addChild(this.backbone);

    // calculate scale factor between backbone coordinates in pixels
    bioModel.view.pixelScaleFactor = this.backbone.bounds.height/bioModel.length;
    bioModel.view.backbone = this.globalBounds;

    // Setup groups for markers and labels
    let markerGroup = new Group({parent:this});
    this.addChild(markerGroup);
    this.markerGroup = markerGroup;
    markerGroup.bounds = this.backbone.bounds;
    this.addChild(markerGroup);
    let labelGroup = new Group({parent:this});
    this.addChild(labelGroup);
    this.labelGroup = labelGroup;
    labelGroup.bounds = new Bounds({
      top: 0,
      left: this.backbone.bounds.right + 1,
      height: this.bounds.height,
      width: 20
    });

    // Filter features for drawing
    this.filteredFeatures = bioModel.features.filter( model => {
      return model.length <= 0.00001;
    });

    //Place features and their labels, prepare to add to rtree
    let fmData = [];
    let lmData = [];
    this.featureMarks = this.filteredFeatures.map( model => {
      let fm = new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: bioModel
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
        maxX: lm.globalBounds.right,
        data: lm
      });
      return fm;
    });

    // Load group rtrees for markers and labels
    markerGroup.locMap.load(fmData);
    labelGroup.locMap.load(lmData);
    console.log(fmData);
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
    let step =(visc.start*(coord.stop*psf - 12) +	visc.stop*(12 - coord.start* psf))/(psf*(coord.stop - coord.start)) - start;
		console.log(step);
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
