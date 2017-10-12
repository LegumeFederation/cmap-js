/**
 *
 * Base Component, placeholder for other canvas components
 *
 */

import m from 'mithril';

import {mix} from '../../../../mixwith.js/src/mixwith';
import {DrawLazilyMixin} from '../../../canvas/DrawLazilyMixin';
import {Bounds} from '../../../model/Bounds';

export class BioMapComponent {
  constructor(vnode){
    console.log('setting up BMC',vnode,vnode.attrs,vnode.state);
    vnode.state = vnode.attrs;
  }
  oninit(){
  }
  oncreate(vnode){
		console.log("creating stuff!",vnode.attrs);
    vnode.state = vnode.attrs;
    vnode.state.canvas = vnode.state.bioMap.canvas = this.el = vnode.dom;
    vnode.state.domBounds = vnode.state.bioMap.domBounds;
    vnode.state.context2d = vnode.state.bioMap.canvas = this.context2d = vnode.state.canvas.getContext('2d');
		vnode.state.draw = this.draw;
    vnode.state.bioMap.context2d = vnode.state.context2d;
  }
  onbeforeupdate(vnode){
    console.log(this);
  }
  onupdate(vnode){
    //vnode.state.draw(vnode);
    vnode.state.bioMap.draw();
  }

  view(vnode) {
    // store these bounds, for checking in drawLazily()
		let domBounds = vnode.state.domBounds || null;
    if(domBounds && ! domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = domBounds;
    }
    console.log('view',domBounds);
    let b = domBounds || {};
    let selectedClass = vnode.state.selected ? 'selected' : '';
    return  m('canvas', {
       class: `cmap-canvas cmap-biomap ${selectedClass}`,
       style: `left: ${b.left}px; top: ${b.top}px;
               width: ${b.width}px; height: ${b.height}px;
               transform: rotate(${vnode.state.rotation}deg);`,
       width: b.width,
       height: b.height
     });
  }

  draw(vnode){
		console.log('draw me!',this,vnode);
		if(! vnode) return;
    let ctx = vnode.state.context2d;
		console.log(ctx);
    if(! ctx) return;
    console.log('draw bounds', vnode.state.bioMap);
    ctx.clearRect(0, 0, vnode.state.canvas.width, vnode.state.canvas.height);
    ctx.save();
		ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 20, 20);
    //ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    //this.visible.map(child => child && child.data.draw(ctx));
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    //this.lastDrawnCanvasBounds = this.bounds;
  }
}

