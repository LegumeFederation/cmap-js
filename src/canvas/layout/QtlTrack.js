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
      for( let i = 0 ; i < qtlGroups.length; i++){
        let qtlConf = qtlGroups[i];
        let qtlGroup = new Group({parent:this, tags:[qtlConf.filter]});
        this.addChild(qtlGroup);
        let offset = this.qtlGroup !== undefined ? this.qtlGroup.bounds.right + 20 : 0;
        this.qtlGroup = qtlGroup;
        qtlGroup.bounds = new Bounds({
          top:0,
          left: offset,
          width:20,
          height: b.height
        });

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
            initialConfig:this.parent.model.qtlGroups[i]
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
            this.maxLoc = this.globalBounds.right;
            this.bounds.right = this.globalBounds.left + (fm.globalBounds.right - this.globalBounds.left);
            qtlGroup.bounds.right = qtlGroup.bounds.left + (fm.globalBounds.right - qtlGroup.globalBounds.left) + fm.offset; //set to fm.textWidth
          }
          return fm;
        });
        this.locMap.load(fmData);
      }
    } else { // TODO: Rewrite so that this isn't required to be here
      let qtlGroup = new Group({parent:this});
      this.addChild(qtlGroup);
      this.qtlGroup = qtlGroup;
      
      qtlGroup.bounds = new Bounds({
        top:0,
        left:0,
        width:0,
        height: b.height
      });
    }
  }

  get visible(){
    return this.locMap.all();
    //return this.locMap.all().concat([{data:this}]); // debugging statement to test track width bounds
  } 
  
  draw(ctx){
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = '#ADD8E6';
    this.children.forEach( child => {
      let cb = child.globalBounds;
      ctx.fillRect(
        Math.floor(cb.left),
        Math.floor(cb.top),
        Math.floor(cb.width),
        Math.floor(cb.height)
      );
    });
    ctx.restore();
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
      });
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
