/**
 * ColorPicker.js
 * Mithril component for a colorselector tool.
 *
 */
import m from 'mithril';
import PubSub from 'pubsub-js';

import {mix} from '../../../mixwith.js/src/mixwith';
import {RegisterComponentMixin} from '../RegisterComponentMixin';
import {pageToCanvas} from '../../util/CanvasUtil';

export class ColorPicker {
  oncreate(vnode){
    this.order = vnode.attrs.order;
    let settings = vnode.attrs.baseAttrs.settings;
    this.colors = {
      baseColor : settings.trackColor[this.order] || settings.trackColor[0] || 'red',
      currentColor : '',
      hueValueColor : ''
    };

  }
  view(vnode) {
    var baseDiv = this;
    // store these bounds, for checking in drawLazily()
    return  [ m('div.color-picker', [
        m(new BaseSelector(),{info:baseDiv}),
        m(new SaturationSelector(),{info:baseDiv}),
        m(new ColorPreview(),{info:baseDiv}),
        m('div#color-apply-controls',{style:'text-align:center; margin-left:10px; display:inline-block; padding:auto'},
          [m(new ColorApplyButton(),{info:baseDiv,settings:vnode.attrs.baseAttrs.settings}),
          m(new ColorResetButton(),{info:baseDiv})]
        )
     ])
    ];
  }
}

export class BaseSelector extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.order = vnode.attrs.info.order;
    this.colors = vnode.attrs.info.colors;
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.context2d.fillStyle = this.colors.baseColor;
    //use the context to convert the original color into a hex string
    //avoiding needing to parse html color words
    vnode.attrs.info.colors.baseColor = this.context2d.fillStyle;
    vnode.attrs.info.colors.currentColor = this.context2d.fillStyle;
    vnode.attrs.info.colors.hueValueColor = rgbToHsv(hexToRgb(this.context2d.fillStyle));
    //PubSub.publish('hueValue',{color:this.colors, order:this.order});
     
    this.ptrPos = this._posFromHsv(this.colors.hueValueColor);
    console.log('test ptr',this.ptrPos);
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    };
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate() {
		this.draw();
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    return  m('canvas', {
      class: 'color-canvas-main',
      style: 'width: 200; height: 100;',
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
      let point = pageToCanvas(evt, this.canvas);
      this._locationChange(point);
    }
    return true;
  }

  _locationChange(evt){
    this.ptrPos = {
      x:evt.x,
      y:evt.y
    };

    this.colors.hueValueColor = this._hsvFromPos(this.ptrPos);
    this._changeColor();
  }

  _changeColor(){
    //PubSub to alert the Saturation slider that the position has changed
    //order is passed to not update *every* color selector
    PubSub.publish('hueValue',{color:this.colors, order:this.order});
    this.draw();
   }

  _posFromHsv(hsv){
    // Math.round to avoid annoying sub-pixel rendering
    return {
      x: Math.round(hsv[0]/360*(this.canvas.width)),
      y: Math.round((1-(hsv[2]/100))*(this.canvas.height))
    };
  }

  _hsvFromPos(pos){
    let h = (pos.x*360)/this.canvas.width;
    let s = 100;
    let l = 100*(1-(pos.y/this.canvas.height));
    return [h,s,l];
  }
}

export class SaturationSelector extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.order = vnode.attrs.info.order;
    this.colors = vnode.attrs.info.colors;
    this.context2d = this.canvas.getContext('2d');
    this.ptrPos = 0;
    PubSub.subscribe('hueValue', (msg,data)=>{if(data.order === this.order) this._hueUpdated(data.color);});
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    };
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate() {
		this.draw();
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    return  m('canvas', {
      class: 'color-canvas-sat',
      style: 'margin-left:10px; width: 20; height: 100;',
      width: 20,
      height: 100
    });
  }

	draw(){
    let ctx = this.context2d;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var grad = ctx.createLinearGradient(0, 0, 0,this.canvas.height);
    let hueValueColor = this.colors.hueValueColor;
    let rgbStart = hsvToRgb([hueValueColor[0],100,hueValueColor[2]]).map(color => {
      return Math.floor(color);
    });
    let rgbStop = hsvToRgb([hueValueColor[0],0,hueValueColor[2]]).map(color => {
      return Math.floor(color);
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
      var point = pageToCanvas(evt, this.canvas);
      this._changeColor(point);
    }
    return true;
  }

  _changeColor(evt){
    this.ptrPos = evt.y;
    this._hueUpdated(this.colors);
   }

  _hueUpdated(updatedColors){
    this.colors = updatedColors;
    let hsv = updatedColors.hueValueColor;
    this.hueValueColor = [hsv[0],this._sFromPos(this.ptrPos),hsv[2]];
    this.colors.hueValueColor = this.hueValueColor;
    PubSub.publish('satUpdated',{order:this.order,currentColors:this.colors});
    this.draw();
  }

  _posFromHsv(hsv){
    return Math.round(1-(hsv[1]/100))*(this.canvas.height);
  }

  _sFromPos(pos){
    return 100*(1-(pos/this.canvas.height));
  }
}

export class ColorPreview extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.order = vnode.attrs.info.order;
    this.colors = vnode.attrs.info.colors;
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    PubSub.subscribe('satUpdated',(msg,data) =>{
      if(this.order === data.order){
        let fillColor = hsvToRgb(data.currentColors.hueValueColor).map(color => {
          return Math.floor(color);
        });
        this.colors.currentColor = `rgba(${fillColor[0]},${fillColor[1]},${fillColor[2]},1)`;
        this.draw();
      }
    });
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate() {
		this.draw();
  }

  /**
   * mithril component render method
   */
  view() {
    return  m('canvas#color-canvas-preview', {
      style: 'margin-left:10px; width: 20; height: 100;',
      width: 20,
      height: 100
     });
  }

	draw(){
    let ctx = this.context2d;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.colors.currentColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.strokeStyle='black';
		ctx.lineWidth=1;
		ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);
  }

  handleGesture(){
    return true;
  }
}

// Use currently selected color
export class ColorApplyButton extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.order = vnode.attrs.info.order;
  }

  /**
   * mithril component render method
   */
  view(vnode) {
    // store these bounds, for checking in drawLazily()
    return  m('button.approve-button', {
      style: 'display:block; width:100%;',
      onclick:()=>{
        vnode.attrs.settings.trackColor[this.order] = vnode.attrs.info.colors.currentColor;
      }
    },'Apply');
  }

  handleGesture(){
    return true;
  }
}

// Reset color to prior
export class ColorResetButton extends mix().with(RegisterComponentMixin) {
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.order = vnode.attrs.info.order;
  }

  /**
   * mithril component render method
   */
  view(vnode) {
    // store these bounds, for checking in drawLazily()
    return  m('button.reset-button', {
      style: 'display:block; width:100%',
       onclick:()=>{
        vnode.attrs.info.colors.currentColor = vnode.attrs.info.colors.baseColor;
       }
     },'Reset');
  }

  handleGesture(){
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

  // Conversion from RGB -> HSV colorspace
	let cmin = Math.min(Math.min(rgb[0],rgb[1]),rgb[2]);
	let cmax = Math.max(Math.max(rgb[0],rgb[1]),rgb[2]);
	let delta = cmax-cmin;
	let hue = 0;
  if(delta === 0){
    hue = 0;
  } else if( cmax === rgb[0]){
		hue = 60*(((rgb[1]-rgb[2])/delta));
	} else if( cmax === rgb[1]){
		hue = 60*(((rgb[2]-rgb[0])/delta)+2);
	} else if( cmax === rgb[2]){
		hue = 60*(((rgb[0]-rgb[1])/delta)+4);
	}

	let sat = cmax === 0 ? 0 : (delta/cmax)*100;
	let value = cmax*100;

	return [hue,sat,value];
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
