/**
 * Class representing a biological map and its associated tracks
 * @class BioMap
 * @extends SceneGraphNodeCanvas
 */

import {Bounds} from '../../model/Bounds';
// drawing layouts and geometry
import {SceneGraphNodeCanvas} from '../node/SceneGraphNodeCanvas';
import {SceneGraphNodeGroup as Group} from '../node/SceneGraphNodeGroup';
import {MapTrack} from '../layout/MapTrack';
import {FeatureTrack} from '../layout/FeatureTrack';
import {TestDot} from '../geometry/TestDot';
import {SelectBox} from '../../canvas/geometry/SelectBox';


export default class BioMap extends SceneGraphNodeCanvas {

  /**
   * Create a new bio map
   *
   * @param {object} bioMapModel - Parsed model of the bio map to be drawn
   * @param {object} appState - Application's meta state object
   * @param {object} layoutBounds - Bounds object of position on screen
   * @param {number} bioMapIndex - bio map's order on screen,
   * @param {object} initialView - bio map's original layout, used for resetting view
   */

  constructor({bioMapModel, appState, layoutBounds, bioMapIndex, initialView, canvas, sub}) {
    super({model: bioMapModel, sub: sub});
    console.log('constructing bioMap');
    //this.setCanvas(canvas); //set canvas and rendering context
    this.initialView = initialView;
    this.bioMapIndex = bioMapIndex;
    this.model.visible = {
      start: this.model.coordinates.start,
      stop: this.model.coordinates.stop
    };
    let bm =appState.bioMaps[bioMapIndex].view; //in case the view was altered by the querystring to start
    if(bm === undefined) bm = {};
    bm.visible = bm.visible || {};
    this.model.view = {
      base: {
        start: this.model.coordinates.start,
        stop: this.model.coordinates.stop
      },
      visible: {
        start: bm.visible.start ? bm.visible.start : this.model.coordinates.start,
        stop: bm.visible.stop ? bm.visible.stop : this.model.coordinates.stop,
      },
      invert : (typeof bm.invert === 'boolean') ? bm.invert :this.model.config.invert
    };
    this.canvas = undefined;

    this.model.manhattanPlot = this.initialView.manhattan || null;
    this.zoomDelta = (this.model.view.base.stop - this.model.view.base.start) / this.model.config.ruler.steps;
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

    //display elements that can be added via mouse events
    this.selectionBox = null;
    this.clickPosition = null;
    this.dirty = true;
    this._layout(layoutBounds);
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
      console.log('cVis', child);
      return child.visible;
    });
    cVis.forEach(item => {
      vis = vis.concat(item);
    });
    //if(this.circle) vis = vis.concat[{data:this.circle}];

    return vis;
  }

  /**
   * getter for the R-tree of subnodes.
   * @return rbush R-tree
   */

  get hitMap() {
    return this.locMap;
  }

  //public functions
  /**
   * Handles mouse wheel zoom
   * @param delta - zoom event
   * @returns {boolean} returns true to stop event propagation further down layers
   *
   */

  zoomMap(delta) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (don't scale the canvas element itself)
    console.warn('BioMap -> onZoom', delta);
    // normalise scroll delta
    this.verticalScale = delta < 0 ? -this.zoomDelta : this.zoomDelta;
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

    this.model.view.visible = {
      start: zStart,
      stop: zStop
    };
  }

  //private functions

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
      //top: this.lb.top,
      top:0,
      width: width > 300 ? width : 300,
      height: this.lb.height
    });

    this.bounds = this.bounds || new Bounds({
      left: 0,
      top:  40,
      width: this.domBounds.width,
      height: Math.floor(this.domBounds.height - 140) // set to reasonably re-size for smaller windows
    });

    //Add children tracks
    this.bbGroup = new Group({parent: this});
    this.bbGroup.bounds = new Bounds({
      top: this.bounds.top,
      left: this.model.config.ruler.labelSize * 10,
      width: 10,
      height: this.bounds.height
    });
    this.bbGroup.model = this.model;
    this.backbone = new MapTrack({parent: this});
    this.bbGroup.addChild(this.backbone);
    this.model.view.backbone = this.backbone.backbone.globalBounds;
    this.ruler = this.backbone.ruler;
    //this.ruler = new Ruler({parent: this, bioMap: this.model, config: this.model.config.ruler});
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

    this.tracksRight =[];
    this.tracksLeft = [];
    console.log('bm model',this.model);
    if(!this.model.tracks && this.model.config.tracks){
      this.model.tracks =this.model.config.tracks;
    }
    if(this.model.tracks) {
      this.model.tracks.forEach((track,order) => {
        track.tracksIndex = order;
        if (track.position === -1) {
          this.tracksRight.push(track);
        } else {
          this.tracksLeft.push(track);
        }
      });
    }

    let qtlRight = new FeatureTrack({parent:this,position:1});
    let qtlLeft = new FeatureTrack({parent:this,position:-1});
    // let qtlRight = {};
    //let qtlRight = new QtlTrack({parent: this , position: 1});
    //let qtlLeft = new QtlTrack({parent: this, position: -1});
    this.addChild(qtlRight);
    this.addChild(qtlLeft);

    if (qtlLeft && qtlLeft.bounds.right > this.bbGroup.bounds.left) {
      const bbw = this.bbGroup.bounds.width;
      this.bbGroup.bounds.left = qtlLeft.globalBounds.right + 100;
      this.bbGroup.bounds.width = bbw;
      const qrw = qtlRight.bounds.width;
      qtlRight.bounds.left += qtlLeft.globalBounds.right;
      qtlRight.bounds.right = qtlRight.bounds.left + qrw;
    }
    console.log('qtl right bounds', qtlRight.globalBounds.right);
    if (this.domBounds.width < qtlRight.globalBounds.right) {
      this.domBounds.width = qtlRight.globalBounds.right + 50;
    }

    //load local rBush tree for hit detection
    this._loadHitMap();
    //let layout know that width has changed on an element;
    //m.redraw();
    this.inform();
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

  // Event Behavior
  addCircle(position) {
    let radius = 4;
    if (!this.clickPosition) {
      this.clickPosition = new TestDot({parent: this, position: position, radius: radius});
      this.addChild(this.clickPosition);
    } else {
      this.clickPosition.position = position;
    }

    this._loadHitMap();

    this.dirty = true;
    //this.inform();

    return this._calculateHits(
      {
        left: position.x - radius,
        right: position.x + radius,
        top: position.y - radius,
        bottom: position.y + radius
      }
    );

  }

  onPanStart(position) {
    if (!this.ruler) this._layout(this.domBounds);
    let rulerBounds = this.ruler.globalBounds;
    let evtType = null;
    let rbx = position.x >= rulerBounds.left && position.x <= rulerBounds.right;
    let rby = position.y >= rulerBounds.top && position.y <= rulerBounds.bottom;

    if (rbx && rby) {
      evtType = 'panRuler';
    } else {
      evtType = 'boxSelect';
      this._addSelectionBox(position);
    }

    if (this.clickPosition) this.removeChild(this.clickPosition);
    this.clickPosition = new TestDot({parent: this, position: position, radius: 4});
    this.addChild(this.clickPosition);
    //this.inform();
    return evtType;
  }

  onPan({position, delta = {x: 0, y: 0}, type}) {
    console.log('on pan', position, delta, type);
    if (type === 'boxSelect') {
      this._updateSelectionBox(position);
    }
    if (type === 'panRuler') {
      console.log('panRuler');
      this._panRuler(delta);
    }
    // this.inform();
  }

  onPanEnd({position, type}) {
    let hits = null;
    if (type === 'boxSelect') {
      this.onPan({position: position, type: type});
      //Determine if select box or zoom box
      let gb = this.ruler.globalBounds;
      let sb = this.selectionBox.bounds;
      let sgb = this.selectionBox.globalBounds;
      let lCorner = sgb.left < sgb.right ? sgb.left : sgb.right;
      let rCorner = sgb.right > sgb.left ? sgb.right : sgb.left;
      // if zoom rectangle contains the ruler, zoom, else populate popover
      if (((lCorner <= gb.left) && (rCorner >= gb.left)) || ((lCorner <= gb.right && rCorner >= gb.right))) {
        let newStartPos = sb.top >= gb.top ? sb.top : gb.top;
        let newStopPos = sb.bottom <= gb.bottom ? sb.bottom : gb.bottom;
        this._updateRulerVisible({top: newStartPos, bottom: newStopPos});
      } else {
        hits = this._calculateHits(sb);
      }
      //Remove the box graphic
      this._clearSelectionBox();
      // this.inform();
    }
    return hits || [];
  }

  _addSelectionBox(position) {
    this.selectionBox = new SelectBox({parent: this, position: position});
    this.addChild(this.selectionBox);
  }

  _updateSelectionBox(position) {
    this.selectionBox.updatePosition(position);
  }

  _clearSelectionBox() {
    this.removeChild(this.selectionBox);
    this.selectionBox = null;
  }

  _panRuler(delta) {
    if (this.model.config.invert) {
      delta.y = -delta.y;
    }
    let scaleDelta = (delta.y) / this.model.view.pixelScaleFactor;
    // prevent moving off top/bottom of ruler range
    if (this.model.view.visible.start + scaleDelta < this.model.view.base.start) {
      scaleDelta = this.model.view.base.start - this.model.view.visible.start;
    } else if (this.model.view.visible.stop + scaleDelta > this.model.view.base.stop) {
      scaleDelta = this.model.view.base.stop - this.model.view.visible.stop;
    }

    this.model.view.visible = {
      start: this.model.view.visible.start + scaleDelta,
      stop: this.model.view.visible.stop + scaleDelta
    };
  }

  _updateRulerVisible(bounds) {
    this.model.view.visible = this.model.view.base;
    let baseStart = this._pixelToCoordinate(bounds.top - this.ruler.globalBounds.top);
    let baseStop = this._pixelToCoordinate(bounds.bottom - this.ruler.globalBounds.top);
    let swap = baseStart < baseStop;
    let zStart = swap ? baseStart : baseStop;
    let zStop = swap ? baseStop : baseStart;

    if (zStart < this.model.view.base.start) {
      zStart = this.model.view.base.start;
    }
    if (zStop > this.model.view.base.stop) {
      zStop = this.model.view.base.stop;
    }

    this.model.view.visible = {
      start: zStart,
      stop: zStop
    };
  }

  _calculateHits(bounds) {
    let left = bounds.left <= bounds.right;
    let top = bounds.top <= bounds.bottom;
    this._loadHitMap();
    let hits = this.hitMap.search({
      minX: left ? bounds.left : bounds.right,
      maxX: left ? bounds.right : bounds.left,
      minY: top ? bounds.top : bounds.bottom,
      maxY: top ? bounds.bottom : bounds.top
    });
    return hits;
  }
}
