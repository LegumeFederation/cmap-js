/**
  * SceneGraphNodeGeometry
  * 
  * A SceneGraphNode representing a drawn feature on the canvas.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import { Bounds } from '../../model/Bounds';

export class SceneGraphNodeGeometry extends SceneGraphNodeBase {

  constructor(params) {
    super(params);
    this.coordinates = params.coordinates;
    this.rangeOfCoordinates = params.rangeOfCorrdinates;
    this.alianses = params.aliases;
  }

}

/**
  * Rectangle
  * A SceneGraphNode representing a Rectangle.
  *
  * Requires two points, top-left and bottom-right
  */

export class Line extends SceneGraphNodeGeometry {
  constructor(params) {
    super(params);
    this.strokeStyle = params.strokeStyle || 'black';
    this.lineWidth = params.lineWidth || '1.0';
  }

  draw(ctx){
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.moveTo(Math.floor(this.coordinates.x1), Math.floor(this.coordinates.y1));
    ctx.lineTo(Math.floor(this.coordinates.x2), Math.floor(this.coordiantes.y2));
    ctx.stroke();
  }
}

/**
  * Rectangle
  * A SceneGraphNode representing a Rectangle.
	*
	*	Requires two points, top left and bottom right
  */

export class Rectangle extends SceneGraphNodeGeometry {
  constructor(params) {
    super(params);
    this.strokeStyle = params.stroke || 'black';
    this.lineWidth = params.lineWidth || '1.0';
    this.fillStyle = params.fillStyle || 'lightgrey';
  }

  draw(ctx) {
    ctx.fillStyle = this.fillStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
		ctx.fillRect(
      Math.floor(this.coordinates.x1),
      Math.floor(this.coordinates.y1),
      Math.floor(this.coordinates.x2),
      Math.floor(this.coordinates.y2)
    );

    ctx.strokeRect(
      Math.floor(this.coordinates.x1),
      Math.floor(this.coordinates.y1),
      Math.floor(this.coordinates.x2),
      Math.floor(this.coordinates.y2)
    );
    ctx.stroke();
  }
}

/**
  * Quadrilateral 
  * A SceneGraphNode representing a quadrilateral.
	*
	*	Requires four points, one for each corner.
  */
export class Quadrilateral extends SceneGraphNodeGeometry {
  constructor(params) {
    super(params);
    this.strokeStyle = params.stroke || 'black';
    this.lineWidth = params.lineWidth || '1.0';
    this.fillStyle = params.fillStyle || 'lightgrey';
  }

  draw(ctx) {
    ctx.fillStyle = this.fillStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.moveTo(Math.floor(this.coordinates.x1), Math.floor(this.coordinates.y1));
    ctx.lineTo(Math.floor(this.coordinates.x2), Math.floor(this.coordinates.y2));
    ctx.lineTo(Math.floor(this.coordinates.x3), Math.floor(this.coordinates.y3));
    ctx.lineTo(Math.floor(this.coordinates.x4), Math.floor(this.coordinates.y4));
    ctx.lineTo(Math.floor(this.coordinates.x1), Math.floor(this.coordinates.y1));
    ctx.stroke();
  }
}
