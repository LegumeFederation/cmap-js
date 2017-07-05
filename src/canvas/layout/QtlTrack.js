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
    console.log('QtlTrack -> constructor',this.parent.domBounds);
    const b = this.parent.bounds;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: this.parent.bounds.top,
      left: this.parent.backbone.bounds.right + 100,
      width: 50,
      height: b.height
    });
    console.log('QTL filter', this.parent.model);
    if(this.parent.model.qtlGroups){
      let qtlGroups = this.parent.model.qtlGroups;
      for( let i = 0 ; i < 2; i++){
        let qtlConf = qtlGroups[i];
        let qtlGroup = new Group({parent:this});
        this.addChild(qtlGroup);
        this.qtlGroup = qtlGroup;
       
        qtlGroup.bounds = new Bounds({
          top:0,
          left:0 + (100*i),
          width:20,
          height: b.height
        });
        console.log(qtlConf);
        this.mapCoordinates = this.parent.mapCoordinates;
        this.filteredFeatures = this.parent.model.features.filter( model => {
          return model.tags[0].match(qtlConf.filter) !== null;
        });
        console.log('QTL filter',this.filteredFeatures);
        console.log('QTL filter', this.parent.model.source);
        let fmData = [];
        this.maxLoc = 0;
        this.qtlMarks = this.filteredFeatures.map( model => {
          let fm = new QTL ({
            featureModel: model,
            parent: this.qtlGroup,
            bioMap: this.parent.model,
            fill:this.parent.model.qtlGroups[i].color
          });
          qtlGroup.addChild(fm);
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
        console.log(this.locMap.all());
      }
    } else {
      let qtlGroup = new Group({parent:this});
      this.addChild(qtlGroup);
      this.qtlGroup = qtlGroup;
      
      qtlGroup.bounds = new Bounds({
        top:0,
        left:0,
        width:20,
        height: b.height
      });
    }
  }

  get visible(){
    return this.locMap.all();
    //return this.locMap.all().concat([{data:this}]);
  }
  
  draw(ctx){
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
    let hits = [];
    let childPos = this.children.map(child => {
      return child.children.map( qtlGroup =>{
        return {
          minY: qtlGroup.globalBounds.top,
          maxY: qtlGroup.globalBounds.bottom,
          minX: qtlGroup.globalBounds.left,
          maxX: qtlGroup.globalBounds.right ,
          data: qtlGroup
        };
      })  
    });
    console.log(childPos);
    childPos.forEach( childArray =>{
      console.log(childArray);
      hits = hits.concat(childArray);
      console.log(hits);
    });
    console.log(hits);
   return hits;
    //  return {
    //    minY: child.globalBounds.top,
    //    maxY: child.globalBounds.bottom,
    //    minX: child.globalBounds.left,
    //    maxX: child.globalBounds.right ,
    //    data: child
    //  };
    //});
  }
}
