/**
  * FeatureMarker
  * A SceneGraphNode representing a feature on a Map with a line or hash mark.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class FeatureLabel extends SceneGraphNodeBase {
  
  draw(ctx) {
      //this.drawLabel();
  }

  // drawLabel() {
  //   // FIXME: dont calculate all these measures every draw cycle
  //   let ctx = this.context2d;
  //   let canvasWidth = ctx.canvas.clientWidth;
  //   let canvasHeight = ctx.canvas.clientHeight;
  //   let width = canvasWidth * 0.33;
  //   let height = canvasHeight * 0.95;
  //   let coordinatesToPixels = height / this.rangeOfCoordinates.end;
  //   let gutter = Math.floor(width * 0.2);
  //   let x = Math.floor(canvasWidth * 0.5 - width * 0.5 - gutter)
  //   let y = Math.floor(height * 0.025 + this.coordinates.start * coordinatesToPixels);
  //   ctx.font = '9px sans-serif';
  //   ctx.fillStyle = 'black';
  //   ctx.fillText(this.featureName, x, y, gutter);
  // }
}
