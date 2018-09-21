/**
 * Class representing a biological map and its associated tracks
 * @class BioMap
 * @extends SceneGraphNodeCanvas
 */


//import m from 'mithril';
//import PubSub from 'pubsub-js';
//import {featureUpdate, dataLoaded} from '../../topics';

import {Bounds} from '../../model/Bounds';
//import {pageToCanvas} from '../../util/CanvasUtil';

import {SceneGraphNodeCanvas} from '../node/SceneGraphNodeCanvas';
import {SceneGraphNodeGroup as Group} from '../node/SceneGraphNodeGroup';
import {MapTrack} from '../layout/MapTrack';
import {FeatureTrack} from '../layout/FeatureTrack';
import {testDot} from '../../canvas/geometry/testDot';

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

    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap: new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
   // this._layout(layoutBounds);
    this.dirty = true;
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

    console.log('onZoom', this);
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

    this.dirty = true;
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

    console.log('layout bm', this.domBounds,this.bbGroup);
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
    this.domBounds.width = width;
    if (this.domBounds.width < qtlRight.globalBounds.right + 30) {
      this.domBounds.width = qtlRight.globalBounds.right + 50;
    }

    //load local rBush tree for hit detection
    this._loadHitMap();
    //let layout know that width has changed on an element;
    //m.redraw();
    this.dirty = false;
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

  addCircle(position) {
    if (!this.circle) {
      this.circle = new testDot({parent: this, position: position});
      this.addChild(this.circle);
    } else {
      this.circle.position = position;
    }

    //draw:function(ctx){
    //  console.log('try to draw', ctx);
    //  ctx.beginPath();
    //  ctx.fillStyle = 'red';
    //  ctx.arc(10, 10, 20, 0, 2 * Math.PI, false);
    //  ctx.fill();
    //}
    console.log('add circle', this.children, position);
    this.dirty = true;
    this.inform();
  }

}
