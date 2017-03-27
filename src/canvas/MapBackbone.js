/*
* Draw a rectangle representing the backbone of a Map.
*/
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class MapBackbone extends SceneGraphNodeBase {

  // es6 destructuring: call like MapBackBone({context2d: ctx})
  constructor({context2d}) {
    super({context2d});
    this.context2d = context2d;
  }

  draw() {
    let ctx = this.context2d;
    let canvasWidth = ctx.canvas.clientWidth;
    let canvasHeight = ctx.canvas.clientHeight;
    let width = canvasWidth * 0.33;
    let height = canvasHeight * 0.95;
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(
      Math.floor(canvasWidth * 0.5 - width * 0.5),
      Math.floor(height * 0.025),
      Math.floor(width),
      Math.floor(height)
    );
  }
}
