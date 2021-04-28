/**
 * Placeholder for advanced group nodes 
 */
import {Bounds} from '../../model/Bounds';
import {SceneGraphNodeGroup} from './SceneGraphNodeGroup';

export class SceneGraphNodeOverlay extends SceneGraphNodeGroup {

  /**
   * Constructor
   * @param params
   */
  
  constructor(params) {
    super(params);
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: this.parent.bounds.width,
      height: this.parent.bounds.height,
    });
  }

  layout() {
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: this.parent.bounds.width,
      height: this.parent.bounds.height,
    });
    //layout children
    this.children.forEach(child => child.layout());
    //update bounds if this width < parent width (widen canvas as needed)
    if(this.parent && this.canvasBounds.right > this.parent.canvasBounds.right){
      this.updateWidth({width: this.canvasBounds.right});
    }
  }
}
