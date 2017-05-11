/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import rbush from 'rbush';
import knn from 'rbush-knn';

import {SceneGraphNodeTrack} from './SceneGraphNodeTrack';
import { Group } from './SceneGraphNodeGroup';
import {Bounds} from '../model/Bounds';
import {FeatureMark} from './FeatureMark';
import {MapBackbone} from './MapBackbone';
import {FeatureLabel} from './FeatureLabel';

export class  MapTrack extends SceneGraphNodeTrack {

  constructor(params) {
    super(params);
    console.log('mapTrack',this.parent);
    const b = this.parent.bounds;
    //const backboneWidth = b.width * 0.2;
    const backboneWidth =  60;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.height * 0.025,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: b.height * 0.95
    });
    this.mC = this.parent.mapCoordinates;
    this.backbone = new MapBackbone({ parent: this});	
    this.addChild(this.backbone);

    let markerGroup = new Group({parent:this});
    this.addChild(markerGroup);

    this.markerGroup = markerGroup;
    markerGroup.bounds = this.backbone.bounds;
    this.addChild(markerGroup);
    
    let labelGroup = new Group({parent:this});
    this.addChild(labelGroup);
    this.labelGroup = labelGroup;
    labelGroup.bounds = new Bounds({
      top: this.backbone.bounds.top,
      left: this.backbone.bounds.right + 1,
      height: this.backbone.bounds.height,
      width: 20
    });

    this.filteredFeatures = this.parent.model.features.filter( model => {
      return model.length <= 0.00001;
    });

    let fmData = [];
    let lmData = [];
    this.featureMarks = this.filteredFeatures.map( model => {
      let fm = new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: this.parent.model
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

    markerGroup.locMap.load(fmData);
    labelGroup.locMap.load(lmData);
    console.log(fmData);
    this.locMap.load(fmData);
  }

  get visible(){
    let coord = this.mapCoordinates.base;
    let visc = this.mapCoordinates.visible;
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
    return vis;
  }

  get hitMap(){
    let bbGb = this.backbone.globalBounds;
    return this.markerGroup.children.map( child =>{
      return {
        minY: child.globalBounds.bottom,
        maxY: child.globalBounds.top,
        minX: bbGb.left ,
        maxX: bbGb.right ,
        data: child
      };
    });
  }

  loadLabelMap(){
  }
}
