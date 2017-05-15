/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {Bounds} from '../model/Bounds';

export class Ruler extends SceneGraphNodeBase {

  constructor(params) {
    super(params);
    console.log('Adding Ruler');
    this.mapCoordinates = params.parent.mapCoordinates;
    this.pixelScaleFactor = this.parent.backbone.markerGroup.children[0].pixelScaleFactor;
    const b = params.parent.backbone.backbone.globalBounds;
    const backboneWidth = this.parent.bounds.width;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: params.parent.backbone.backbone.globalBounds.top,
      left: b.left -20,
      width: 10,
      height: b.height 
    });
    console.log(this);
  }

  draw(ctx) {
    this.children.forEach( child => child.draw(ctx));
    let start = this._translateScale(this.mapCoordinates.visible.start) * this.pixelScaleFactor;
    let stop = this._translateScale(this.mapCoordinates.visible.stop) * this.pixelScaleFactor;
    console.log('drawing Ruler',start,stop);
    let gb = this.globalBounds || {};

		ctx.beginPath();
    ctx.lineWidth = 1.0;
		ctx.strokeStyle = 'black';
    ctx.moveTo(Math.floor(gb.left + gb.width/2), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.left + gb.width/2), Math.floor(gb.bottom));
    ctx.stroke();

    ctx.fillStyle = 'aqua';
		var height = stop - start > 1 ? stop-start : 1.0;
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(start + gb.top),
      Math.floor(gb.width),
      Math.floor(height)
    );

		ctx.font = '12px Raleway';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
		let text = [this.mapCoordinates.base.start,this.mapCoordinates.base.stop];
    ctx.fillText(text[0],gb.left - 5 - ctx.measureText(text[0]).width,(gb.top));
    ctx.fillText(text[1],gb.left - 5 - ctx.measureText(text[1]).width,(gb.bottom));

  }

  _translateScale(point){
    let vis = this.mapCoordinates.base;
    let coord = this.mapCoordinates.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }

  get  visible(){
    return {data:this};
  }
}
