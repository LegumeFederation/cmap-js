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
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: y1,
      left: 0,
      width: 10,
      height: y2-y1
    });
  }

  draw(ctx) {
    console.log('drawingQTL');
    let gb = this.globalBounds || {};
    console.log(gb);
    ctx.fillStyle = 'Black';
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
