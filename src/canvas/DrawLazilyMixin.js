/**
 * lazily draw on the canvas, because mithril updates the dom asynchronously.
 * The canvas will be cleared when mithril writes the new width and height
 * of canvas element into dom. So we cannot draw upon canvas until after that.
 */
import {Bounds} from '../model/Bounds.js';

export let DrawLazilyMixin = (superclass) => class extends superclass {

  /**
   *
   * @param wantedBounds
   */

  drawLazily(wantedBounds) {
    if (wantedBounds.area === 0) return;
    if (this._drawLazilyTimeoutId) clearTimeout(this._drawLazilyTimeoutId);
    if (!Bounds.areaEquals(this.lastDrawnMithrilBounds, wantedBounds)) {
      console.log('waiting for wantedBounds from mithril: ',
        wantedBounds.width, wantedBounds.height);
      let tid1 = this._drawLazilyTimeoutId = setTimeout(() => {
        if (tid1 !== this._drawLazilyTimeoutId) return;
        this.drawLazily(wantedBounds);
      });
    }
    else {
      console.log('scheduling lazy draw for: ',
        wantedBounds.width, wantedBounds.height);
      let tid2 = this._drawLazilyTimeoutId = setTimeout(() => {
        if (tid2 !== this._drawLazilyTimeoutId) return;
        if (!Bounds.areaEquals(this.lastDrawnCanvasBounds, wantedBounds)) {
          this.draw();
        }
      });
    }
  }
};
