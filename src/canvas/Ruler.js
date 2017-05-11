/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import {SceneGraphNodeTrack} from './SceneGraphNodeTrack';
import {Bounds} from '../model/Bounds';

export class  ZoomRuler extends SceneGraphNodeTrack {

  constructor(params) {
    super(params);
    console.log('mapZoomBar');
    const b = this.parent.backbone.backbone.bounds;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.height ,
      left: b.left - 40,
      width: 20,
      height: b.height
    });
    console.log('setting up ruler');
  }

  draw(ctx) {
    let gb = this.globalBounds || {};
    console.log('drawing ruler',gb);
    ctx.beginPath();
    ctx.lineWidth = 5.0;
    ctx.strokeStyle = 'black';
    ctx.moveTo(Math.floor(10), Math.floor(0));
    ctx.moveTo(Math.floor(10), Math.floor(500));
    ctx.stroke();
    console.log('ruler Drawn');
  //  let y1 = this._translateScale(this.model.coordinates.start) * this.pixelScaleFactor;
  //  let y2 = this._translateScale(this.model.coordinates.stop) * this.pixelScaleFactor;
  //  let start = this._translateScale(this.mapCoordinates.visible.start) * this.pixelScaleFactor;
  //  let stop = this._translateScale(this.mapCoordinates.visible.stop) * this.pixelScaleFactor;
  //  if (y2 < start || y1 > stop) return;
  //  if (y1 < start) y1 = start;
  //  if (y2 > stop) y2 = stop;
  //  this.bounds = new Bounds({
  //    top: y1,
  //    height: y2-y1,
  //    left: this.bounds.left,
  //    width: 10
  //  });
  //  let gb = this.globalBounds || {};
  //  ctx.fillStyle = 'DarkBlue';
  //  ctx.fillRect(
  //    Math.floor(gb.left),
  //    Math.floor(gb.top),
  //    Math.floor(gb.width),
  //    Math.floor(gb.height)
  //  );
  //  this.children.forEach( child => child.draw(ctx));
  }
  get visible(){
    return {
      data: this
    }
  }
  _translateScale(point){
    let coord = this.mapCoordinates.base;
    let vis = this.mapCoordinates.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
