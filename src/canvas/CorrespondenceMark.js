/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {Bounds} from '../model/Bounds';

export class CorrespondenceMark extends SceneGraphNodeBase {

  constructor({parent, featurePair, mapCoordinates, bioMap}) {
    super({parent});
    this.model = featurePair;
    this.mapCoordinates = mapCoordinates;
    this.lineWidth = 1.0;
    
    this.pixelScaleFactor = [
      bioMap[0].backbone.backbone.globalBounds.height / bioMap[0].model.length, 
      bioMap[1].backbone.backbone.globalBounds.height / bioMap[1].model.length
    ];
    let leftY = this._translateScale(
        this.mapCoordinates[0].base,
        this.mapCoordinates[0].visible,
        this.model[0].coordinates.start) * this.pixelScaleFactor[0];
    let rightY = this._translateScale(
        this.mapCoordinates[1].base,
        this.mapCoordinates[1].visible,
        this.model[1].coordinates.start) * this.pixelScaleFactor[1];

    this.bounds = new Bounds({
      allowSubpixel: false,
      top: leftY,
      left: parent.bounds.left,
      height: leftY-rightY,
      width: parent.bounds.width
    });
  }

  draw(ctx) {
    let leftY = this._translateScale(
        this.mapCoordinates[0].base,
        this.mapCoordinates[0].visible,
        this.model[0].coordinates.start) * this.pixelScaleFactor[0];
    let rightY = this._translateScale(
        this.mapCoordinates[1].base,
        this.mapCoordinates[1].visible,
        this.model[1].coordinates.start) *  this.pixelScaleFactor[1];
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
