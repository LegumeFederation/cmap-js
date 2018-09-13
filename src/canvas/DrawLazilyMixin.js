/**
 * lazily draw on the canvas, because mithril updates the dom asynchronously.
 * The canvas will be cleared when mithril writes the new width and height
 * of canvas element into dom. So we cannot draw upon canvas until after that.
 */
import {Bounds} from '../model/Bounds';

export let DrawLazilyMixin = (superclass) => class extends superclass {

  /**
   *
   * @param wantedBounds
   */

};
