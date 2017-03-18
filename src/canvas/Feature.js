/*
 * Draw a line and a label representing a feature on a Map.
*/

export class Feature {

  // es6 destructuring: call as Feature({context2d: ..., coordinates: {...}}) etc
  constructor({
    context2d,
    coordinates = {start: 0, end: 0},
    featureName,
    rangeOfCoordinates = { start: 0, end: 0},
    aliases = []
  }) {
    this.context2d = context2d;
    this.coordinates = coordinates;
    this.featureName = featureName;
    this.rangeOfCoordinates = rangeOfCoordinates;
    this.aliases = aliases;
  }

  draw() {
    this.drawLine();
    this.drawLabel();
  }

  drawLine() {
    // FIXME: dont calculate all these measures every draw cycle
    let ctx = this.context2d;
    let canvasWidth = ctx.canvas.clientWidth;
    let canvasHeight = ctx.canvas.clientHeight;
    let width = canvasWidth * 0.33;
    let height = canvasHeight * 0.95;
    let coordinatesToPixels = height / this.rangeOfCoordinates.end;
    let y = Math.floor(height * 0.025 + this.coordinates.start * coordinatesToPixels);
    ctx.beginPath();
    ctx.moveTo(Math.floor(canvasWidth * 0.5 - width * 0.5), y);
    ctx.lineTo(Math.floor(canvasWidth * 0.5 + width * 0.5), y);
    ctx.stroke();
  }

  drawLabel() {
    // FIXME: dont calculate all these measures every draw cycle
    let ctx = this.context2d;
    let canvasWidth = ctx.canvas.clientWidth;
    let canvasHeight = ctx.canvas.clientHeight;
    let width = canvasWidth * 0.33;
    let height = canvasHeight * 0.95;
    let coordinatesToPixels = height / this.rangeOfCoordinates.end;
    let gutter = Math.floor(width * 0.2);
    let x = Math.floor(canvasWidth * 0.5 - width * 0.5 - gutter)
    let y = Math.floor(height * 0.025 + this.coordinates.start * coordinatesToPixels);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(this.featureName, x, y, gutter);
  }
}
