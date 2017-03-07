/* An outer canvas component
 * - is visually and apparently the container (but canvases cannot be nested)
 * - responds to resize of container width
 * - responds to resize events from the zoom tool
*/
import m from 'mithril';
import toolState from '../state/toolState';

let MIN_SIZE = { width: 500, height: 350 };

export class Canvas  {

  constructor() {
    // make mithril aware we are interested in this state
    this.toolState = toolState;
    // set some default values for the width and height of the canvas
    this.boundingBox = { width: MIN_SIZE.width, height: MIN_SIZE.height };
    this.canvasSize = { width: MIN_SIZE.width, height: MIN_SIZE.height };
    this.zoomFactor = 0;
  }

  oncreate(vnode) {
    this._updateWidth(vnode);
  }

  onupdate(vnode) {
    //this._updateZoom();
    this._updateWidth(vnode);
  }

  // resize the canvas, causing the containing div to auto-scroll.
  // _updateZoom() {
  //   // only if there is no other canvas selected
  //   if(this.toolState.selectedCanvas && this.toolState.selectedCanvas !== this) {
  //     return;
  //   }
  //   if(this.zoomFactor !== this.toolState.zoomFactor) {
  //     // a scrollwheel zoom event needs to be processed
  //     this.zoomFactor = this.toolState.zoomFactor;
  //     // retain the original aspect ratio
  //     let aspectRatio = this.boundingBox.width / this.boundingBox.height;
  //     let newHeight = this.canvasSize.height += this.zoomFactor;
  //     if(newHeight > MIN_SIZE.height) {
  //       this.canvasSize.height = newHeight;
  //       this.canvasSize.width = newHeight * aspectRatio;
  //       m.redraw();
  //     }
  //   }
  // }

  _updateWidth(vnode) {
    let bbox = vnode.dom.getBoundingClientRect();
    console.log(bbox);
    let w = Math.floor(bbox.width);
    // check the width vs. the width of bounding box
    if(w !== this.boundingBox.width) {
      this.boundingBox.width = w;
      this.canvasSize.width = w += this.zoomFactor;
      // this function was invoked from oncreate/onupdate, which are lifecycle
      // methods, so mithril will not autorender the above state change.
      m.redraw();
    }
  }

  click() {
    if(this.toolState.selectedCanvas !== this) {
      this.toolState.selectedCanvas = this;
    }
  }

  view() {
    // wrap the canvas in a grid row, to get layout boundingBox
    console.log('render @' + new Date());
    console.log(this.boundingBox);
    return m('div', { class: 'pure-u-1' }, [
      m('div', {
        class: 'canvas-container',
        style: `max-width: ${this.boundingBox.width}px`
      }, [
        m('canvas', {
          class: this.toolState.selectedCanvas === this ?
            'cmap-canvas cmap-canvas-selected' : 'cmap-canvas',
          width: this.canvasSize.width,
          height: this.canvasSize.height,
          onclick: () => this.click()
        })
      ])
    ]);
  }
}
