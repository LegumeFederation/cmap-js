/*
 * Canvas component rendering a Map. Would have been named just 'Map' but Js
 * now has a Map object.
*/
import m from 'mithril';
import {domRectEqual} from '../util/domRect';
import {Feature} from './Feature';
import {MapBackbone} from './MapBackbone';

export class BioMap {

  constructor(mapName) {
    this.mapName = mapName;
  }

  oncreate(vnode) {
    // The outer m() element in view() is a canvas element. So we can get a
    // reference to it by this lifecycle callback.
    let canvas = vnode.dom;
    let context = canvas.getContext('2d');
    this.backbone = new MapBackbone({context2d: context});
    this.children = [];
    for (var i = 0; i < 100; i++) {
      let x = Math.floor(Math.random() * 1000);
      let featureName = '';
      for (var j = 0; j < 2; j++) {
        featureName += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
      let feature = new Feature({
        context2d: context,
        coordinates: {
          start: x,
          end: x, // FIXME: support ranges
        },
        rangeOfCoordinates: { start: 0, end: 1000},
        featureName: featureName,
        aliases: []
      });
      this.children.push(feature);
    }
    this.backbone.draw();
    this.children.forEach( child => {
      child.draw();
    });
  }

  onupdate(vnode) {
    if(! this.children) {
      // for unknown reason, sometimes the onupdate lifecycle fn runs before
      // the oncreate fn. check for existence of this.children.
      return;
    }
    this.backbone.draw();
    this.children.map( child => child.draw() );
  }

  setBounds(b) {
    if(! domRectEqual(this.bounds, b)) {
      this.bounds = b;
    }
  }

  setRotation(degrees) {
    if(this.degrees !== degrees) {
      this.degrees = degrees;
    }
  }

  view() {
    return m('canvas', {
      class: 'cmap-canvas cmap-biomap',
      style: this.bounds ?
            `left: ${this.bounds.left}px; top: ${this.bounds.top}px;
            width: ${this.bounds.width}px; height: ${this.bounds.height}px;
            transform: rotate(${this.degrees}deg)`
            : '',
      width: this.bounds ? this.bounds.width : '',
      height: this.bounds ? this.bounds.height : '',
    });
  }
}
