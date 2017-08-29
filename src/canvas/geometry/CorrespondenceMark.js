/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';

export class CorrespondenceMark extends SceneGraphNodeBase {

  constructor({parent, featurePair, mapCoordinates, bioMap}) {
    super({parent});
    this.model = featurePair;
    this.mapCoordinates = mapCoordinates;
    this.lineWidth = 1.0;
    this.bioMap = bioMap;
    
    this.pixelScaleFactor = [
      bioMap[0].model.view.pixelScaleFactor, 
      bioMap[1].model.view.pixelScaleFactor, 
    ];
    let leftY = (this._translateScale(
        bioMap[0].model.view.base,
        bioMap[0].model.view.visible,
        this.model[0].coordinates.start)+(this.bioMap[0].model.view.base.start*-1)) * this.pixelScaleFactor[0];
    let rightY = (this._translateScale(
        bioMap[1].model.view.base,
        bioMap[1].model.view.visible,
        this.model[1].coordinates.start)+(this.bioMap[1].model.view.base.start*-1)) * this.pixelScaleFactor[1];

    this.bounds = new Bounds({
      allowSubpixel: false,
      top: leftY,
      left: parent.bounds.left,
      height: leftY-rightY,
      width: parent.bounds.width
    });
  }

  draw(ctx) {
    let leftY = (this._translateScale(
        this.bioMap[0].model.view.base,
        this.bioMap[0].model.view.visible,
        this.model[0].coordinates.start)+(this.bioMap[0].model.view.base.start*-1)) * this.pixelScaleFactor[0];
    let rightY = (this._translateScale(
        this.bioMap[1].model.view.base,
        this.bioMap[1].model.view.visible,
        this.model[1].coordinates.start)+(this.bioMap[1].model.view.base.start*-1)) *  this.pixelScaleFactor[1];
    this.bounds.top = leftY;
    this.bounds.bottom = rightY;
    let gb = this.globalBounds || {};

    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = '#CAA91E';
    ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.right), Math.floor(gb.bottom));
    ctx.stroke();
  }

  _translateScale(oCord,nCord,point){
    let coord = oCord;
    let vis = nCord;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
