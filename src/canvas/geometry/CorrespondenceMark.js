/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';
import {translateScale} from '../../util/CanvasUtil';

export class CorrespondenceMark extends SceneGraphNodeBase {

  constructor({parent, featurePair, mapCoordinates, bioMap}) {
    super({parent});
    this.model = featurePair;
    this.mapCoordinates = mapCoordinates;
    this.lineWidth = 1.0;
    this.bioMap = bioMap;
    this.invert = [bioMap[0].model.config.invert, bioMap[1].model.config.invert];
    
    this.pixelScaleFactor = [
      bioMap[0].model.view.pixelScaleFactor, 
      bioMap[1].model.view.pixelScaleFactor, 
    ];

    let leftY = translateScale(
        this.model[0].coordinates.start,
        bioMap[0].model.view.base,
        bioMap[0].model.view.visible,
        this.invert[0]) * this.pixelScaleFactor[0];
    
    let rightY = translateScale(
        this.model[1].coordinates.start,
        bioMap[1].model.view.base,
        bioMap[1].model.view.visible,
        this.invert[1]) * this.pixelScaleFactor[1];

    this.bounds = new Bounds({
      allowSubpixel: false,
      top: leftY,
      left: parent.bounds.left,
      height: leftY-rightY,
      width: parent.bounds.width
    });
  }

  draw(ctx) {
    var bioMap = this.bioMap;
    let leftYStart = translateScale(
      this.model[0].coordinates.start,
      bioMap[0].model.view.base,
      bioMap[0].model.view.visible,
      this.invert[0]) * this.pixelScaleFactor[0];
    
    let rightYStart = translateScale(
      this.model[1].coordinates.start,
      bioMap[1].model.view.base,
      bioMap[1].model.view.visible,
      this.invert[1]) * this.pixelScaleFactor[1];

    if (this.model[0].coordinates.start === this.model[0].coordinates.stop
            && this.model[1].coordinates.start === this.model[1].coordinates.stop) {
      // correspondence line
      this.bounds.top = leftYStart;
      this.bounds.bottom = rightYStart;
      let gb = this.globalBounds || {};
      ctx.beginPath();
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = '#CAA91E';
      ctx.globalAlpha = 0.7;
      ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
      ctx.lineTo(Math.floor(gb.right), Math.floor(gb.bottom));
      ctx.stroke();
    }
    else {
      // correspondence region 
      let leftYStop = translateScale(
        this.model[0].coordinates.stop,
        bioMap[0].model.view.base,
        bioMap[0].model.view.visible,
        this.invert[0]) * this.pixelScaleFactor[0];
      let rightYStop = translateScale(
        this.model[1].coordinates.stop,
        bioMap[1].model.view.base,
        bioMap[1].model.view.visible,
        this.invert[1]) * this.pixelScaleFactor[1];

      this.bounds.top = leftYStart;
      this.bounds.bottom = leftYStop;
      let gbLeft = this.globalBounds || {};
      //let leftTop = gbLeft.top;
      //let leftBot = gbLeft.bottom;
      this.bounds.top = rightYStart;
      this.bounds.bottom = rightYStop;
      let gbRight = this.globalBounds || {};
      //let rightTop = gbRight.top;
      //let rightBot = gbRight.bottom;

      ctx.beginPath();
      ctx.lineWidth = this.lineWidth;
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#7C6400';//'#A4870C';
      ctx.moveTo(Math.floor(gbLeft.left), Math.floor(gbLeft.top));
      ctx.lineTo(Math.floor(gbLeft.left), Math.floor(gbLeft.bottom));
      ctx.lineTo(Math.floor(gbRight.right), Math.floor(gbRight.bottom));
      ctx.lineTo(Math.floor(gbRight.right), Math.floor(gbRight.top));
      ctx.fill();
    }
  }
}
