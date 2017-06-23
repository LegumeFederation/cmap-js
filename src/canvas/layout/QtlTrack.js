/**
  * QtlTrack 
  * A SceneGraphNode representing a collection of QTLs.
  */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import { Group } from '../node/SceneGraphNodeGroup';
import {Bounds} from '../../model/Bounds';
import {QTL} from '../geometry/QTL';

export class  QtlTrack extends SceneGraphNodeTrack {

  constructor(params) {
    super(params);
    console.log('mapTrack',this.parent.domBounds);
    const b = this.parent.bounds;
    const backboneWidth = b.width * 0.25;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: this.parent.bounds.top,
      left: this.parent.backbone.bounds.right + 100,
      width: 50,
      height: b.height
    });
    this.mapCoordinates = this.parent.mapCoordinates;

    let qtlGroup = new Group({parent:this});
    this.addChild(qtlGroup);
    this.qtlGroup = qtlGroup;

    qtlGroup.bounds = new Bounds({
        top:0,
        left:0,
        width:20,
        height: b.height
    });
    this.filteredFeatures = this.parent.model.features.filter( model => {
      return model.length > 1;
    });
    console.log('filtered features', this.filteredFeatures);
    let fmData = [];
    this.maxLoc = 0;
    this.qtlMarks = this.filteredFeatures.map( model => {
      let fm = new QTL ({
        featureModel: model,
        parent: this.qtlGroup,
        bioMap: this.parent.model
      });
      qtlGroup.addChild(fm);
      console.log(fm.globalB);
      let loc = {
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data:fm
      };
      qtlGroup.locMap.insert(loc);
      fmData.push(loc);
      if(fm.globalBounds.right > this.globalBounds.right){
        this.bounds.right = this.globalBounds.left + fm.bounds.right;
      }
      return fm;
    });
    this.locMap.load(fmData);
    console.log('visible qtls',this.visible);
  }

  get visible(){
    return this.locMap.all();
    //return this.locMap.all().concat([{data:this}]);
  }
  
  draw(ctx){
    console.log(this.parent.backbone.labelGroup.globalBounds);
    let gb = this.globalBounds || {};
    ctx.fillStyle = 'red';
    ctx.fillRect(
      Math.floor(this.parent.backbone.labelGroup.globalBounds.right),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
  }

  get hitMap(){
    //return [];
    return this.qtlGroup.children.map( child =>{
      return {
        minY: child.globalBounds.top,
        maxY: child.globalBounds.bottom,
        minX: child.globalBounds.left,
        maxX: child.globalBounds.right ,
        data: child
      };
    });
  }
}
