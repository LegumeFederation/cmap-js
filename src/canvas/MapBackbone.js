/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class MapBackbone extends SceneGraphNodeBase {

  draw(ctx) {
    let gb = this.globalBounds || {};
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
  }
}
