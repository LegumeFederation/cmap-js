/**
  * MapBackbone
  * A SceneGraphNode representing a backbone, simply a rectangle representing
  * the background.
  */
import {SceneGraphNodeBase} from '../node/SceneGraphNodeBase';
import {Bounds} from '../../model/Bounds';

export class MapBackbone extends SceneGraphNodeBase {

  constructor({parent, bioMap}) {
    super({parent});
    const b = parent.bounds;
    const backboneWidth = parent.bounds.width;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.height * 0.025,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: b.height * 0.95
    });
    console.log(bioMap);
    bioMap.view.backbone = this.globalBounds;
  }

  draw(ctx) {
    let gb = this.globalBounds || {};
    ctx.fillStyle = '#fff6e8';
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
    this.children.forEach( child => child.draw(ctx));
  }
}
