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
      top: b.top,
      left: this.parent.ruler.globalBounds.left,
      width: 200,
      height: b.height
    });
    this.mapCoordinates = this.parent.mapCoordinates;

    let qtlGroup = new Group({parent:this});
    this.addChild(qtlGroup);
    this.qtlGroup = qtlGroup;

    qtlGroup.bounds = this.bounds;
    this.filteredFeatures = this.parent.model.features.filter( model => {
      return model.length > 1;
    });
    console.log('filtered features', this.filteredFeatures);
    let fmData = [];
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
      return fm;
    });
    console.log(qtlGroup.children.length);
    this.locMap.load(fmData);
    console.log('visible qtls',this.visible);
  }

  get visible(){
    return this.locMap.all();
    //return this.locMap.search({
    //  minX: this.bounds.left,
    //  maxX: this.bounds.right,
    //  minY: this.mapCoordinates.visible.start,
    //  maxY: this.mapCoordinates.visible.stop
    //});
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
