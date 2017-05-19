/**
  * ruler
  * A SceneGraphNode representing ruler and zoom position for a given backbone
  *
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';

export class Ruler extends SceneGraphNodeBase {

  constructor({parent, bioMap}) {
    super({parent});
    this.mapCoordinates = bioMap.view;
    this.pixelScaleFactor = this.mapCoordinates.pixelScaleFactor;
    const b = this.mapCoordinates.backbone;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.top,
      left: b.left -20,
      width: 10,
      height: b.height 
    });
  }

  draw(ctx) {
    let start = this._translateScale(this.mapCoordinates.visible.start) * this.pixelScaleFactor;
    let stop = this._translateScale(this.mapCoordinates.visible.stop) * this.pixelScaleFactor;
		let text = [this.mapCoordinates.base.start.toFixed(4),this.mapCoordinates.base.stop.toFixed(4)];
    let w = ctx.measureText(text[0]).width > ctx.measureText(text[1]).width ? ctx.measureText(text[0]).width : ctx.measureText(text[1]).width;
   
    let gb = this.globalBounds || {};
    // draw baseline labels
		ctx.font = '12px Nunito';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
    ctx.fillText(text[0],gb.right - w + 5, (gb.top));
    ctx.fillText(text[1],gb.right - w + 5,(gb.bottom + 12));

    //Draw baseline ruler
		ctx.beginPath();
    ctx.lineWidth = 1.0;
		ctx.strokeStyle = 'black';
    ctx.moveTo(Math.floor(gb.left - w + gb.width/2), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.left - w + gb.width/2), Math.floor(gb.bottom));
    ctx.stroke();

    // Draw "zoom box"
    ctx.fillStyle = 'aqua';
		var height = stop - start > 1 ? stop-start : 1.0;
    ctx.fillRect(
      Math.floor(gb.left - w),
      Math.floor(start + gb.top),
      Math.floor(gb.width),
      Math.floor(height)
    );

    // Draw zoom position labels
		text = [this.mapCoordinates.visible.start.toFixed(4),this.mapCoordinates.visible.stop.toFixed(4)];
    ctx.fillStyle = 'black';
    ctx.fillText(text[0],gb.left - w - 5 - ctx.measureText(text[0]).width,(start+gb.top));
    ctx.fillText(text[1],gb.left - w - 5 - ctx.measureText(text[1]).width,(start+gb.top + height + 12));

    this.children.forEach( child => child.draw(ctx));
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
