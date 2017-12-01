/**
  * QtlTrack 
  * A SceneGraphNode representing a collection of QTLs.
  */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {Bounds} from '../../model/Bounds';
import {QTL} from '../geometry/QTL';

export class  QtlTrack extends SceneGraphNodeTrack {

  constructor(params) {
    super(params);
    console.log('QtlTrack -> constructor',this.parent.domBounds,params.position);
    const b = this.parent.bounds;
    this.trackPos = params.position || 1;

    let left = this.trackPos < 0 ? 10 : this.parent.bbGroup.bounds.right; 
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.top,
      left: left, 
      width: 50,
      height: b.height
    });
    if(this.parent.model.qtlGroups && this.parent.model.qtlGroups.length > 0){
      let qtlGroups = this.parent.model.qtlGroups;
      for( let i = 0 ; i < qtlGroups.length; i++){
        let qtlConf = qtlGroups[i];
        // only draw the tracks on this group's sides, if no position given, defaults to RHS
        qtlConf.position = qtlConf.position || 1;
        if(this.trackPos !== qtlConf.position) continue;

        if (typeof qtlConf.filters === 'string'){ qtlConf.filters = [qtlConf.filters];}
        if (typeof qtlConf.trackColor === 'string'){ qtlConf.trackColor = [qtlConf.trackColor];}        
        let qtlGroup = new SceneGraphNodeGroup({parent:this, tags:qtlConf.filters.slice(0)});
        qtlGroup.lp = qtlConf.position || 1;
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
        this.filteredFeatures = [];
        qtlConf.filters.forEach( (filter,order) => {
            var test = this.parent.model.features.filter( model => {
              return model.tags[0].match(filter) !== null;
            })
            if(test.length === 0){
              // get rid of any tags that don't actually get used
              qtlConf.filters.splice(order,1);
            } else {
              this.filteredFeatures = this.filteredFeatures.concat(test);
            }
        });
        this.filteredFeatures.sort((a,b)=>{return a.coordinates.start - b.coordinates.start;});
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
      let qtlGroup = new SceneGraphNodeGroup({parent:this});
      this.addChild(qtlGroup);
      this.qtlGroup = qtlGroup;
      qtlGroup.lp = 0; 
      qtlGroup.bounds = new Bounds({
        top:0,
        left:0,
        width:0,
        height: b.height
      });
    }
  }

  get visible(){
    //return this.locMap.all();
    return this.locMap.all().concat([{data:this}]); // debugging statement to test track width bounds
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
    childPos.forEach( childArray =>{
      hits = hits.concat(childArray);
    });
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
