/**
  * BioMap
  * Mithril component representing a Biological Map with a html5 canvas element.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import Hammer from 'hammerjs';
import {mix} from '../../mixwith.js/src/mixwith';

import {Bounds} from '../model/Bounds';
import {FeatureMark} from './FeatureMark';
import {MapBackbone} from './MapBackbone';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import { Group }  from './SceneGraphNodeGroup';
import {DrawLazilyMixin} from './DrawLazilyMixin';
import {RegisterComponentMixin} from '../ui/RegisterComponentMixin';
import {selectedMap} from '../topics';

export class BioMap
       extends mix(SceneGraphNodeBase)
       .with(DrawLazilyMixin, RegisterComponentMixin) {

  constructor({bioMapModel, appState, layoutBounds}) {
    super({});
    this.model = bioMapModel;
    this.appState = appState;
    this.verticalScale = 1;
    this.backbone = null;
    this.featureMarks = [];
    this.featureLabels = [];
    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
    this._layout(layoutBounds);
  }

  // override the children prop. getter
 // get children() {
 //   return [this.backbone].concat(
 //     this.featureMarks,
 //     this.featureLabels
 //   );
 // }
 // set children(ignore) {}

  get selected() {
    return this.appState.selection.bioMaps.indexOf(this) !== -1;
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.drawLazily(this.domBounds);
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    // TODO: remove this development assistive method
    console.assert(this.el === vnode.dom);
    let b = new Bounds(this.el.getBoundingClientRect());
    console.log('BioMap.onupdate', b.width, b.height, this.el);
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    if(this.domBounds && ! this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    let selectedClass = this.selected ? 'selected' : '';
    return m('canvas', {
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: rotate(${this.rotation}deg);`,
      width: b.width,
      height: b.height
    });
  }

  /**
   * draw our scenegraph children our canvas element
   */
  draw() {
    let ctx = this.context2d;
    if(! ctx) return;
    if(! this.domBounds) return;
    console.log('BioMap canvas draw', this.domBounds.width, this.domBounds.height);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    //ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.children.map(child => child && child.draw(ctx));
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
  }

  /**
   * custom gesture event dispatch listener; see LayoutContainer
   */
  handleGesture(evt) {
    if(evt.type.match(this._gestureRegex.tap)) {
      return this._onTap(evt);
    }
    else if (evt.type.match(this._gestureRegex.pinch)) {
      return this._onZoom(evt);
    }
    else if(evt.type.match(this._gestureRegex.wheel)) {
      return this._onZoom(evt);
    }
    else if(evt.type.match(this._gestureRegex.pan)) {
      return this._onPan(evt);
    }
    return false; // dont stop evt propagation
  }

  _onTap(evt) {
    let sel = this.appState.selection.bioMaps;
    let i = sel.indexOf(this);
    if(i === -1) {
      sel.push(this);
    }
    else {
      sel.splice(i, 1);
    }
    m.redraw();
    PubSub.publish(selectedMap, {
      evt: evt,
      data: this.appState.selection.bioMaps
    });
    return true;
  }

  _onZoom(evt) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onZoom -- implement me', evt);
    this.verticalScale += evt.deltaY;
    return true; // stop event propagation
  }

  _onPan(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    if(evt.direction & Hammer.DIRECTION_VERTICAL) {
      console.warn('BioMap -> onPan -- vertically; implement me', evt);
      return true; // stop event propagation
    }
    return false; // do not stop propagation
  }

  /**
   * perform layout of backbone, feature markers, and feature labels.
   */

  /**
   *
   * Lifecycle of a layout change
   *  - Get new canvas bounds
   *  - Place backbone
   *  - Place groups (markers, QTLs, &c)
   *  - Update rbush trees
   *  - Update conngruence map(s)
   */
  _layout(layoutBounds) {
    // TODO: calculate width based on # of SNPs in layout, and width of feature
    // labels
    console.log('layout BioMap');
    const width = Math.floor(100 + Math.random() * 200);
    this.children = [];
    console.log(this.children);
    this.domBounds = new Bounds({
      left: layoutBounds.left,
      top: layoutBounds.top,
      width: width,
      height: layoutBounds.height
    });
    // this.bounds (scenegraph) has the same width and height, but zero the
    // left/top because we are the root node in a canvas sceneGraphNode
    // heirarchy
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
    // note map backbone will use this.bounds for it's own layout
    this.backbone = new MapBackbone({ parent: this });
    this.addChild(this.backbone);

    let markerGroup = new Group({parent:this.backbone});
    this.addChild(markerGroup);
    markerGroup.bounds = this.backbone.bounds;


    let filteredFeatures = this.model.features.filter( model => {
      return model.length <= 0.00001;
    });
    this.featureMarks = filteredFeatures.map( model => {
      return new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: this.model
      });
    });

    this.featureMarks.forEach( mark => {
      markerGroup.addChild(mark);
    });

    console.log(this.children);
  }
}
