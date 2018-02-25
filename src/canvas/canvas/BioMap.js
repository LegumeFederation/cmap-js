/**
 * Class representing a biological map and its associated tracks
 * @class BioMap
 * @extends SceneGraphNodeCanvas
 */


import m from 'mithril';
//import PubSub from 'pubsub-js';
//import {featureUpdate, dataLoaded} from '../../topics';

import {Bounds} from '../../model/Bounds';
import {SceneGraphNodeCanvas} from '../node/SceneGraphNodeCanvas';
import {SceneGraphNodeGroup as Group} from '../node/SceneGraphNodeGroup';
import {MapTrack} from '../layout/MapTrack';
import {QtlTrack} from '../layout/QtlTrack';
import {Ruler} from '../geometry/Ruler';
import {pageToCanvas} from '../../util/CanvasUtil';

export class BioMap extends SceneGraphNodeCanvas {

  /**
   * Create a new bio map
   *
   * @param {object} bioMapModel - Parsed model of the bio map to be drawn
   * @param {object} appState - Application's meta state object
   * @param {object} layoutBounds - Bounds object of position on screen
   * @param {number} bioMapIndex - bio map's order on screen
   */

  constructor({bioMapModel, appState, layoutBounds, bioMapIndex}) {
    super({model: bioMapModel});
    this.bioMapIndex = bioMapIndex;
    this.model.visible = {
      start: this.model.coordinates.start,
      stop: this.model.coordinates.stop
    };
    this.model.view = {
      base: {
        start: this.model.coordinates.start,
        stop: this.model.coordinates.stop
      },
      visible: {
        start: this.model.coordinates.start,
        stop: this.model.coordinates.stop
      }
    };
    this.zoomDelta = (this.model.view.base.stop - this.model.view.base.start) / this.model.config.rulerSteps;
    // set up coordinate bounds for view scaling
    this.appState = appState;
    this.verticalScale = 0;
    this.backbone = null;
    this.featureMarks = [];
    this.featureLabels = [];
    this.info = {
      top: 0,
      left: 0,
      display: 'none'
    };

    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap: new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
    this._layout(layoutBounds);
    this.dirty = true;

  }

  /*
   *  debug draw to test that the layer is positioned properly
   */
  /*
    draw(ctx){
   ctx = this.context2d;
   this.children.forEach(child => child.draw(ctx));
   ctx.save();
   ctx.globalAlpha = .5;
   ctx.fillStyle = '#f442e2';
   this.children.forEach( child => {
     let cb = child.globalBounds;
     ctx.fillRect(
       Math.floor(cb.left),
       Math.floor(cb.top),
       Math.floor(cb.width),
       Math.floor(cb.height)
     );
   });
   ctx.restore();
 }
*/
  /**
   * Mithril lifecycle method on initial vnode creation.
   * @param {object} vnode - node on mithril vnode representing this canvas item
   */

  oncreate(vnode) {
    super.oncreate(vnode);
//    PubSub.subscribe(featureUpdate, () => {
//      this._layout(this.lb);
//      this._redrawViewport(this.model.view.visible);
//    });
  }

  // getters and setters

  /**
   * Culls elements to draw.
   *
   * @return array of elements visible in current canvas' viewport
   *
   */

  get visible() {
    let vis = [];
    let cVis = this.children.map(child => {
      return child.visible;
    });
    cVis.forEach(item => {
      vis = vis.concat(item);
    });
    return vis;
  }

  /**
   * getter for the R-tree of subnodes.
   * @return rbush R-tree
   */

  get hitMap() {
    return this.locMap;
  }

  // Private functions

  // gesture components

  /**
   * Handles mouse wheel zoom
   * @param evt - zoom event
   * @returns {boolean} returns true to stop event propagation further down layers
   * @private
   */

  _onZoom(evt) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onZoom', evt);
    // normalise scroll delta
    this.verticalScale = evt.deltaY < 0 ? -this.zoomDelta : this.zoomDelta;
    let mcv = this.model.view.base;
    let zStart = (this.model.view.visible.start + this.verticalScale);
    let zStop = (this.model.view.visible.stop - this.verticalScale);
    if (zStop - zStart < .01) {
      this.verticalScale -= 0.5;
      return true;
    }
    if (zStart < mcv.start) {
      zStart = mcv.start;
    } else if (zStart > zStop) {
      zStart = zStop;
    }

    if (zStop > mcv.stop) {
      zStop = mcv.stop;
    } else if (zStop < zStart) {
      zStop = zStart;
    }
    this._redrawViewport({start: zStart, stop: zStop});
    return true; // stop event propagation
  }

  /**
   * Handles tap/click event on canvas
   * @param evt - tap event
   * @returns {boolean} return true to stop event prorogation further down layers
   * @private
   */

  _onTap(evt) {
    console.log('BioMap -> onTap', evt, this);
    let globalPos = pageToCanvas(evt, this.canvas);
    this._loadHitMap();
    let hits = [];

    this.hitMap.search({
      minX: globalPos.x,
      maxX: globalPos.x,
      minY: globalPos.y - 2,
      maxY: globalPos.y + 2
    }).forEach(hit => {
      // temp fix, find why hit map stopped updating properly
      if ((hit.data.model.coordinates.start >= this.model.view.visible.start) &&
        (hit.data.model.coordinates.start <= this.model.view.visible.stop)) {
        hits.push(hit.data);
      } else if ((hit.data.model.coordinates.stop >= this.model.view.visible.start) &&
        (hit.data.model.coordinates.stop <= this.model.view.visible.stop)) {
        hits.push(hit.data);
      }
    });
    if (hits.length > 0) {
      hits.sort((a, b) => {
        return a.model.coordinates.start - b.model.coordinates.start;
      });
      this.info.display = 'inline-block';
      this.info.top = hits[0].globalBounds.top;
      this.info.left = hits[0].globalBounds.right;
      this.info.data = hits;
      let names = hits.map(hit => {
        return hit.model.name;
      });
      //@awilkey: is this obsolete?
      //TODO: Revisit info popovers
      this.info.innerHTML = `<p> ${names.join('\n')} <\p>`;
      m.redraw();
    } else if (this.info.display !== 'none') {
      this.info.display = 'none';
      m.redraw();
    }

    return true;
  }

  /**
   *  Handle start of pan events on canvas, box zooms if ruler is part of selected or
   *  mass select if not.
   *
   * @param evt - tap event
   * @returns {boolean} return true to stop event prorogation further down layers
   * @private
   */

  _onPanStart(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    this.zoomP = {
      start: 0,
      end: 0,
      pStart: true,
      ruler: false,
      delta: 0,
      corner: 0
    };
    this.zoomP.pStart = true;
    console.warn('BioMap -> onPanStart -- vertically; implement me', evt);
    let globalPos = pageToCanvas(evt, this.canvas);
    let left = this.ruler.globalBounds.left;
    // scroll view vs box select
    if (left < (globalPos.x - evt.deltaX) &&
      (globalPos.x - evt.deltaX) < (left + this.ruler.bounds.width)) {
      this.zoomP.ruler = true;
      this._moveRuler(evt);
    } else {
      this.zoomP.ruler = false;
      this.zoomP.start = this._pixelToCoordinate(globalPos.y - this.ruler.globalBounds.top - evt.deltaY);
      if (this.zoomP.start < this.model.view.base.start) {
        this.zoomP.start = this.model.view.base.start;
      }
      let ctx = this.context2d;
      this.zoomP.corner = {top: globalPos.y - evt.deltaY, left: globalPos.x - evt.deltaX};
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'black';
      // noinspection JSSuspiciousNameCombination
      ctx.strokeRect(
        Math.floor(globalPos.x - evt.deltaX),
        Math.floor(globalPos.y - evt.deltaY),
        Math.floor(evt.deltaX),
        Math.floor(evt.deltaY)
      );
    }
    return true;
  }

  /**
   * Pans ruler's position box on click-and-pan
   *
   * @param evt - pan event
   * @private
   */

  _moveRuler(evt) {
    if (this.model.config.invert) {
      evt.deltaY = -evt.deltaY;
    }

    let delta = (evt.deltaY - this.zoomP.delta) / this.model.view.pixelScaleFactor;
    if (this.model.view.visible.start + delta < this.model.view.base.start) {
      delta = this.model.view.base.start - this.model.view.visible.start;
    } else if (this.model.view.visible.stop + delta > this.model.view.base.stop) {
      delta = this.model.view.base.stop - this.model.view.visible.stop;
    }
    this.model.view.visible.start += delta;
    this.model.view.visible.stop += delta;
    this._redrawViewport({start: this.model.view.visible.start, stop: this.model.view.visible.stop});
    this.zoomP.delta = evt.deltaY;
  }

  /**
   * Continue pre-exiting pan event
   *
   * @param evt - continuation of pan event
   * @returns {boolean} return true to stop event prorogation further down layers
   * @private
   */

  _onPan(evt) {
    // block propegation if pan hasn't started
    if (!this.zoomP || !this.zoomP.pStart) return true;
    if (this.zoomP && this.zoomP.ruler) {
      this._moveRuler(evt);
    } else {
      let globalPos = pageToCanvas(evt, this.canvas);
      this.draw();
      let ctx = this.context2d;
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'black';
      // noinspection JSSuspiciousNameCombination
      ctx.strokeRect(
        Math.floor(this.zoomP.corner.left),
        Math.floor(this.zoomP.corner.top),
        Math.floor(globalPos.x - this.zoomP.corner.left),
        Math.floor(globalPos.y - this.zoomP.corner.top)
      );
    }
    return true;
  }

  /**
   * Finalize pan event
   *
   * @param evt - tap event
   * @returns {boolean} return true to stop event prorogation further down layers
   * @private
   */

  _onPanEnd(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onPanEnd -- vertically; implement me', evt, this.model.view.base);
    // block propegation if pan hasn't started
    if (!this.zoomP || !this.zoomP.pStart) return true;
    if (this.zoomP && this.zoomP.ruler) {
      this._moveRuler(evt);
    } else {
      let globalPos = pageToCanvas(evt, this.canvas);

      // test if any part of the box select is in the ruler zone
      let rLeft = this.ruler.globalBounds.left;
      let rRight = this.ruler.globalBounds.right;
      let lCorner = this.zoomP.corner.left < globalPos.x ? this.zoomP.corner.left : globalPos.x;
      let rCorner = lCorner === this.zoomP.corner.left ? globalPos.x : this.zoomP.corner.left;
      // if zoom rectangle contains the ruler, zoom, else populate popover
      if (((lCorner <= rLeft) && (rCorner >= rLeft)) || ((lCorner <= rRight && rCorner >= rRight))) {
        this.model.view.visible = this.model.view.base;

        this.zoomP.start = this._pixelToCoordinate(this.zoomP.corner.top - this.ruler.globalBounds.top);
        this.zoomP.stop = this._pixelToCoordinate(globalPos.y - this.ruler.globalBounds.top);
        let swap = this.zoomP.start < this.zoomP.stop;
        let zStart = swap ? this.zoomP.start : this.zoomP.stop;
        let zStop = swap ? this.zoomP.stop : this.zoomP.start;

        if (zStart < this.model.view.base.start) {
          zStart = this.model.view.base.start;
        }
        if (zStop > this.model.view.base.stop) {
          zStop = this.model.view.base.stop;
        }

        this._redrawViewport({start: zStart, stop: zStop});
      } else {

        this._loadHitMap();
        let hits = [];
        let swap = this.zoomP.corner.left < globalPos.x;
        let swapV = this.zoomP.corner.top < globalPos.y;
        this.hitMap.search({
          minX: swap ? this.zoomP.corner.left : globalPos.x,
          maxX: swap ? globalPos.x : this.zoomP.corner.left,
          minY: swapV ? this.zoomP.corner.top : globalPos.y,
          maxY: swapV ? globalPos.y : this.zoomP.corner.top
        }).forEach(hit => {
          // temp fix, find why hit map stopped updating properly
          if ((hit.data.model.coordinates.start >= this.model.view.visible.start) &&
            (hit.data.model.coordinates.start <= this.model.view.visible.stop)) {
            hits.push(hit.data);
          } else if ((hit.data.model.coordinates.stop >= this.model.view.visible.start) &&
            (hit.data.model.coordinates.stop <= this.model.view.visible.stop)) {
            hits.push(hit.data);
          }
        });
        if (hits.length > 0) {
          hits.sort((a, b) => {
            return a.model.coordinates.start - b.model.coordinates.start;
          });
          this.info.display = 'inline-block';
          this.info.top = this.ruler.globalBounds.top;
          this.info.left = 0;
          this.info.data = hits;
          let names = hits.map(hit => {
            return hit.model.name;
          });
          //@awilkey: is this obsolete?
          this.info.innerHTML = `<p> ${names.join('\n')} <\p>`;
          m.redraw();
        } else if (this.info.display !== 'none') {
          this.info.display = 'none';
          m.redraw();
        }
      }
    }
    this.draw();
    this.zoomP = {
      start: 0,
      end: 0,
      pStart: false,
      ruler: false,
      delta: 0,
      corner: {
        top: 0,
        left: 0
      }
    };
//    this.zoomP.ruler = false;
//    this.zoomP.pStart = false;
    return true; // do not stop propagation
  }


  /**
   *  Converts a pixel position to the  canvas' backbone coordinate system.
   *
   *  @param {number} point - pixel position on screen
   *  @return {number} backbone position
   *
   *  @private
   */

  _pixelToCoordinate(point) {
    let coord = this.model.view.base;
    let visc = this.model.view.visible;
    let psf = this.model.view.pixelScaleFactor;
    return ((visc.start * (coord.stop * psf - point) + visc.stop * (point - coord.start * psf)) / (psf * (coord.stop - coord.start))) - (coord.start * -1);
  }

  /**
   * perform layout of backbone, feature markers, and feature labels.
   *
   * @param {object} layoutBounds - bounds object representing bounds of this canvas
   *
   * @private
   */

  _layout(layoutBounds) {
    // TODO: calculate width based on # of SNPs in layout, and width of feature
    // labels
    // Setup Canvas
    //const width = Math.floor(100 + Math.random() * 200);
    this.lb = this.lb || layoutBounds;
    console.log('BioMap -> layout');
    const width = Math.floor(this.lb.width / this.appState.bioMaps.length);
    this.children = [];
    this.domBounds = this.domBounds || new Bounds({
      left: this.lb.left,
      top: this.lb.top,
      width: width > 300 ? width : 300,
      height: this.lb.height
    });

    this.bounds = this.bounds || new Bounds({
      left: 0,
      top: this.lb.top + 40,
      width: this.domBounds.width,
      height: Math.floor(this.domBounds.height - 140) // set to reasonably re-size for smaller windows
    });
    //Add children tracks
    this.bbGroup = new Group({parent: this});
    this.bbGroup.bounds = new Bounds({
      top: this.bounds.top,
      left: this.model.config.rulerLabelSize * 10,
      width: 10,
      height: this.bounds.height
    });
    this.bbGroup.model = this.model;
    this.backbone = new MapTrack({parent: this});
    this.bbGroup.addChild(this.backbone);
    this.model.view.backbone = this.backbone.backbone.globalBounds;
    this.ruler = new Ruler({parent: this, bioMap: this.model});
    this.bbGroup.addChild(this.ruler);
    this.backbone.children.forEach(child => {
      if (child.globalBounds.left < this.bbGroup.bounds.left) {
        this.bbGroup.bounds.left = child.globalBounds.left;
      }
      if (child.globalBounds.right > this.bbGroup.bounds.right) {
        this.bbGroup.bounds.right = child.globalBounds.right;
      }
    });
    this.children.push(this.bbGroup);

    let qtlRight = new QtlTrack({parent: this, position: 1});
    let qtlLeft = new QtlTrack({parent: this, position: -1});
    if (qtlLeft && qtlLeft.bounds.right > this.bbGroup.bounds.left) {
      const bbw = this.bbGroup.bounds.width;
      this.bbGroup.bounds.left = qtlLeft.globalBounds.right + 100;
      this.bbGroup.bounds.width = bbw;
      const qrw = qtlRight.bounds.width;
      qtlRight.bounds.left += qtlLeft.globalBounds.right;
      qtlRight.bounds.right = qtlRight.bounds.left + qrw;
    }

    if (this.domBounds.width < qtlRight.globalBounds.right + 30) {
      this.domBounds.width = qtlRight.globalBounds.right + 50;
    }
    this.children.push(qtlRight);
    this.children.push(qtlLeft);
    //load local rBush tree for hit detection
    this._loadHitMap();
    //let layout know that width has changed on an element;
    //m.redraw();
    this.dirty = true;
  }

  /**
   * Adds children nodes to the R-tree
   *
   * @private
   */

  _loadHitMap() {
    let hits = [];
    let childrenHits = this.children.map(child => {
      return child.hitMap;
    });
    childrenHits.forEach(child => {
      hits = hits.concat(child);
    });
    this.locMap.clear();// = rbush();
    this.locMap.load(hits);
  }

  /**
   * Redraw restricted view
   *
   * @param coordinates
   * @private
   */

  _redrawViewport(coordinates) {
    this.model.view.visible = {
      start: coordinates.start,
      stop: coordinates.stop
    };
    this.backbone.loadLabelMap();
    this.draw();

    let cMaps = document.getElementsByClassName('cmap-correspondence-map');
    [].forEach.call(cMaps, el => {
      el.mithrilComponent.draw();
    });
    // move top of popover if currently visible
    if (this.info.display !== 'none') {
      this.info.top = this.info.data[0].globalBounds.top;
    }
    m.redraw();
  }
}
