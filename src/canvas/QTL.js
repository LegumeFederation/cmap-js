/**
  * QTL
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {Bounds} from '../model/Bounds';

export class QTL extends SceneGraphNodeBase {

  constructor({parent, bioMap, featureModel}) {
    super({parent, tags: [featureModel.name]});
    this.model = featureModel;
    this.featureMap = bioMap;
    this.lineWidth = 1.0;
    this.pixelScaleFactor = parent.bounds.height / bioMap.length;
    let y1 = this._translateScale(this.model.coordinates.start) * this.pixelScaleFactor;
    let y2 = this._translateScale(this.model.coordinates.stop) * this.pixelScaleFactor;
    console.log(this.parent.locMap.search({
      minY: this.model.coordinates.start,
      maxY: this.model.coordinates.stop,
      minX: 0,
      maxX:1000
    })
    );
    let leftLoc = 0;
    this.parent.locMap.search({
      minY: this.model.coordinates.start,
      maxY: this.model.coordinates.stop,
      minX: 0,
      maxX:1000
    }).forEach(overlap => {
      if(overlap.data){
        if (overlap.data.bounds.right > leftLoc);
        leftLoc = overlap.data.bounds.right + 3;
      }
    });
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: y1,
      left: leftLoc,
      width: 10,
      height: y2-y1
    });
  }

  draw(ctx) {
    let y1 = this._translateScale(this.model.coordinates.start) * this.pixelScaleFactor;
    let y2 = this._translateScale(this.model.coordinates.stop) * this.pixelScaleFactor;
    let start = this._translateScale(this.mapCoordinates.visible.start) * this.pixelScaleFactor;
    let stop = this._translateScale(this.mapCoordinates.visible.stop) * this.pixelScaleFactor;
    if (y2 < start || y1 > stop) return;
    if (y1 < start) y1 = start;
    if (y2 > stop) y2 = stop;
    this.bounds = new Bounds({
      top: y1,
      height: y2-y1,
      left: this.bounds.left,
      width: 10
    });
    let gb = this.globalBounds || {};
    ctx.fillStyle = 'DarkBlue';
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
    this.children.forEach( child => child.draw(ctx));
  }
	_translateScale(point){
    let coord = this.mapCoordinates.base;
    let vis = this.mapCoordinates.visible;
    return (coord.stop - coord.start)*(point-vis.start)/(vis.stop-vis.start)+coord.start;
  }
}
