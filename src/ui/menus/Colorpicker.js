/**
 * ColorPicker.js
 * Mithril component for a colorselector tool.
 *
 */
import m from 'mithril';
import PubSub from 'pubsub-js';

import {mix} from '../../../mixwith.js/src/mixwith';
import {RegisterComponentMixin} from '../RegisterComponentMixin';

export class ColorPicker {
  view() {
    this.baseColor = 'red';
    this.currentColor = '#FF0000';
    this.hueValueColor = [0,100,100];
    var test = this;
    // store these bounds, for checking in drawLazily()
    let selectedClass = this.selected ? 'selected' : '';
    return  [m('button#color-toggle',{style:`color:${this.currentColor}`},'■'),
    m('div#color-picker', [
        m(new BaseSelector(),{baseColor:this.baseColor,hueValueColor:this.hueValueColor}),
        m(new SaturationSelector(),{hueValueColor:this.hueValueColor,currentColor:this.currentColor}),
        m(new ColorPreview(),{currentColor:this.currentColor,test:test}),
        m('div#color-apply-controls',{style:'margin-left:10px; display:inline-block;'},
          [m('button#approve-color',{style:'display:block'},'Apply'),
          m('button#cancel-color',{style:'display:block'},'Close'),
          m('button#cancel-color',{style:'display:block'},'Reset')]
        )
     ])
    ]
  }
}

export class BaseSelector extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.context2d.fillStyle = vnode.attrs.baseColor;
    this.hsv = rgbToHsv(hexToRgb(this.context2d.fillStyle));
    vnode.attrs.currentColor = this.context2d.fillStyle;
    this.hvColor = vnode.attrs.hueValueColor
    this.ptrPos = this._posFromHsv(this.hsv);
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    }
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
		this.draw();
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    return  m('canvas', {
       class: `color-canvas-main`,
       style: 'top:10; left:10; width: 200; height: 100;',
			 width: 200,
			 height: 100
     });
  }

	draw(){
    let ctx = this.context2d;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // RGB gradient
    var hGrad = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    hGrad.addColorStop(0 / 6, '#F00');
    hGrad.addColorStop(1 / 6, '#FF0');
    hGrad.addColorStop(2 / 6, '#0F0');
    hGrad.addColorStop(3 / 6, '#0FF');
    hGrad.addColorStop(4 / 6, '#00F');
    hGrad.addColorStop(5 / 6, '#F0F');
    hGrad.addColorStop(6 / 6, '#F00');

    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //Fade to black gradient
    var vGrad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vGrad;

    // Draw the selection pointer
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.strokeStyle='black';
    ctx.lineWidth=1;
    ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.ptrPos.x-10,this.ptrPos.y);
    ctx.lineTo(this.ptrPos.x-3,this.ptrPos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.ptrPos.x-3,this.ptrPos.y);
    ctx.lineTo(this.ptrPos.x-1,this.ptrPos.y);
    ctx.moveTo(this.ptrPos.x+1,this.ptrPos.y);
    ctx.lineTo(this.ptrPos.x+3,this.ptrPos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(this.ptrPos.x+3,this.ptrPos.y);
    ctx.lineTo(this.ptrPos.x+10,this.ptrPos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.ptrPos.x,this.ptrPos.y-10);
    ctx.lineTo(this.ptrPos.x,this.ptrPos.y-3);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.ptrPos.x,this.ptrPos.y-3);
    ctx.lineTo(this.ptrPos.x,this.ptrPos.y-1);
    ctx.moveTo(this.ptrPos.x,this.ptrPos.y+1);
    ctx.lineTo(this.ptrPos.x,this.ptrPos.y+3);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(this.ptrPos.x,this.ptrPos.y+3);
    ctx.lineTo(this.ptrPos.x,this.ptrPos.y+10);
    ctx.stroke();
  }

  handleGesture(evt){
    if(evt.type.match(this._gestureRegex.tap) || 
        evt.type.match(this._gestureRegex.pan)){
      this._changeColor(evt);
    }
    return true;
  }

  _changeColor(evt){
    console.log('gesture!',evt);
    
    this.ptrPos = {
      x:evt.srcEvent.layerX,
      y:evt.srcEvent.layerY
    }
    this.hvColor = this._hsvFromPos(this.ptrPos);
    PubSub.publish('hueValue',this.hvColor);
    console.log('gesture ptoh',this._hsvFromPos(this.ptrPos));
    this.draw();
   }

  _posFromHsv(hsv){
    return {
      x: Math.round(hsv[0]/360)*(this.canvas.width),
      y: Math.round(1-(hsv[2]/100))*(this.canvas.height)
    }
  }

  _hsvFromPos(pos){
    let h = (pos.x*360)/this.canvas.width;
    let s = 100;
    let l = 100*(1-(pos.y/this.canvas.height))
    return [h,s,l];
  }
}

export class SaturationSelector extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    vnode.dom.mithrilComponent = this;
    this.currentColor = vnode.attrs.currentColor;
    this.hueValueColor = vnode.attrs.hueValueColor;
    this.context2d = this.canvas.getContext('2d');
    this.ptrPos = 0;
    PubSub.subscribe('hueValue', (msg,data)=>{this._hueUpdated(data);});
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    }
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    // TODO: remove this development assistive method
    console.log('onup',vnode);
		this.draw();
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    return  m('canvas', {
       class: `color-canvas-sat`,
       style: 'margin-left:10px; top:10; left:10; width: 20; height: 100;',
			 width: 20,
			 height: 100
     });
  }

	draw(){
    let ctx = this.context2d;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var grad = ctx.createLinearGradient(0, 0, 0,this.canvas.height);
    let rgbStart = hsvToRgb([this.hueValueColor[0],100,this.hueValueColor[2]]).map(color => {
      return Math.floor(color)
    });
    let rgbStop = hsvToRgb([this.hueValueColor[0],0,this.hueValueColor[2]]).map(color => {
      return Math.floor(color)
    });
    grad.addColorStop(0 , `rgba(${rgbStart[0]},${rgbStart[1]},${rgbStart[2]},1)`);
    grad.addColorStop(1 , `rgba(${rgbStop[0]},${rgbStop[1]},${rgbStop[2]},1)`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.strokeStyle='black';
		ctx.lineWidth=1;
		ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);
   
    ctx.fillStyle = 'black'; 
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(this.canvas.width,this.ptrPos+5);
    ctx.lineTo(this.canvas.width/2, this.ptrPos);
    ctx.lineTo(this.canvas.width,this.ptrPos-5);
    ctx.closePath();
    ctx.fill();
  }

  handleGesture(evt){
    if(evt.type.match(this._gestureRegex.tap) || 
        evt.type.match(this._gestureRegex.pan)){
      this._changeColor(evt);
    }
    return true;
  }

  _changeColor(evt){
    console.log('gesture!',evt);
    this.ptrPos = evt.srcEvent.layerY
    this._hueUpdated(this.hueValueColor);
   }

  _hueUpdated(hsv){
    console.log('hue updated',hsv)
    this.hueValueColor = [hsv[0],this._sFromPos(this.ptrPos),hsv[2]];
    PubSub.publish('satUpdated',this.hueValueColor);
    console.log('hue updated',hsv)
    this.draw();
  }

  _posFromHsv(hsv){
    return Math.round(1-(hsv[1]/100))*(this.canvas.height)
  }

  _sFromPos(pos){
    return 100*(1-(pos/this.canvas.height))
  }
}

export class ColorPreview {
  oncreate(vnode) {
    this.canvas = this.el = vnode.dom;
    vnode.dom.mithrilComponent = this;
    this.test = vnode.attrs.test;
    this.context2d = this.canvas.getContext('2d');
    this.currentColor = vnode.attrs.currentColor;
    this.context2d.fillStyle = vnode.attrs.currentColor;
    this.fillColor = hexToRgb(this.context2d.fillStyle);
    PubSub.subscribe('satUpdated',(msg,data) =>{
      console.log('sat updated!');
      this.fillColor = hsvToRgb(data).map(color => {
        return Math.floor(color)
      });
      this.draw();
    });
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    // TODO: remove this development assistive method
    console.log('gesture preview',vnode.attrs.currentColor);
		this.draw();
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    return  m('canvas', {
       class: `color-canvas-preview`,
       style: 'margin-left:10px; top:10; left:10; width: 20; height: 100;',
			 width: 20,
			 height: 100
     });
  }

	draw(){
    let ctx = this.context2d;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let rgb = this.fillColor;
    ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.test.currentColor = ctx.fillStyle;
		ctx.strokeStyle='black';
		ctx.lineWidth=1;
		ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);
    // store these bounds, for checking in drawLazily()
  }

  handleGesture(evt){
    return true;
  }
}

// #FFFFFF ->[0-255,0-255,0-255]	
export function	hexToRgb(hex){
	var result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)];
}

// [0-255,0-255,0-255] -> [0-360,0-100,0-100]
export function	rgbToHsv(rgb){
	//make sure RGB values are within 0-255 range
	//and convert to decimal
	rgb = rgb.map(component =>{
		return Math.max(0,Math.min(255,component))/255;
	});

	let cmin = Math.min(Math.min(rgb[0],rgb[1]),rgb[2]);
	let cmax = Math.max(Math.max(rgb[0],rgb[1]),rgb[2]);
	let delta = cmax-cmin;
	let hue = 0;
	if( cmax === rgb[0]){
		hue = 60*(((rgb[2]-rgb[1])/delta)%6);
	} else if( cmax === rgb[1]){
		hue = 60*(((rgb[1]-rgb[0])/delta)+2);
	} else if( cmax === rgb[2]){
		hue = 60*(((rgb[0]-rgb[1])/delta)+4);
	}

	let sat = cmax === 0 ? 0 : (delta/cmax)*100;
	let value = cmax*100;

	return [hue,sat,value]
}	

// [0-360,0-100,0-100] -> [0-255,0-255,0-255]
export function	hsvToRgb(hsv){
	let u = 255 * (hsv[2] / 100);
  let h = hsv[0]/60;
  let s = hsv[1]/100;

  let i = Math.floor(h);
  let f = i%2 ? h-i : 1-(h-i);
  let m = u * (1 - s);
  let n = u * (1 - s * f);
  switch (i) {
    case 6:
    case 0: return [u,n,m];
    case 1: return [n,u,m];
    case 2: return [m,u,n];
    case 3: return [m,n,u];
    case 4: return [n,m,u];
    case 5: return [u,m,n];
	}
}
