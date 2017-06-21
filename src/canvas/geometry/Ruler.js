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
    const b = this.parent.backbone.bounds;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: this.parent.bounds.top,
      left: b.left -15, //arbritray spacing to look goo
      width: 10,
      height: b.height 
    });
  }

  draw(ctx) {
    let start = this.mapCoordinates.visible.start * this.pixelScaleFactor;
    let stop = this.mapCoordinates.visible.stop * this.pixelScaleFactor;
		let text = [this.mapCoordinates.base.start.toFixed(4),this.mapCoordinates.base.stop.toFixed(4)];
    let w = ctx.measureText(text[0]).width > ctx.measureText(text[1]).width ? ctx.measureText(text[0]).width : ctx.measureText(text[1]).width;
    this.textWidth = w; 

    let gb = this.globalBounds || {};
    // draw baseline labels
		ctx.font = '12px Nunito';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
    ctx.fillText(text[0],gb.left - ctx.measureText(text[0]).width -5,Math.floor(gb.top - 10));
    ctx.fillText(text[1],gb.left - ctx.measureText(text[1]).width -5,Math.floor(gb.bottom +12 + 5));
    // Draw zoom position labels
		text = [this.mapCoordinates.visible.start.toFixed(4),this.mapCoordinates.visible.stop.toFixed(4)];
    ctx.fillStyle = 'black';
    ctx.fillText(text[0],this.parent.backbone.bounds.left + (Math.abs(ctx.measureText(text[0]).width -this.parent.backbone.bounds.width)/2) , (gb.top - 10));
    ctx.fillText(text[1],this.parent.backbone.bounds.left +(Math.abs(ctx.measureText(text[1]).width -this.parent.backbone.bounds.width)/2),(gb.bottom + 12 + 5));
    

    //Draw baseline ruler
		ctx.beginPath();
    ctx.lineWidth = 1.0;
		ctx.strokeStyle = 'black';
    ctx.moveTo(Math.floor(gb.left), Math.floor(gb.top));
    ctx.lineTo(Math.floor(gb.left), Math.floor(gb.bottom));
    ctx.stroke();

    // Draw "zoom box"
    ctx.fillStyle = 'aqua';
		var height = stop - start > 1 ? stop-start : 1.0;
    ctx.fillRect(
      Math.floor(gb.left -gb.width/2),
      Math.floor(start + gb.top),
      Math.floor(gb.width),
      Math.floor(height)
    );

    this.children.forEach( child => child.draw(ctx));
  }

  get  visible(){
    return {data:this};
  }
}
