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
    const config = bioMap.config;
    const backboneWidth = config.backboneWidth;
    this.fillStyle = config.backboneColor;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: b.width * 0.5 - backboneWidth * 0.5,
      width: backboneWidth,
      height: b.height
    });
    bioMap.view.backbone = this.globalBounds;
  }

  draw(ctx) {
    let gb = this.globalBounds || {};
    console.log('drawing', gb);
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
    this.children.forEach( child => child.draw(ctx));
  }
}
