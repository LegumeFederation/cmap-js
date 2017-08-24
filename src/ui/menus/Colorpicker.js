/**
 * ColorPicker.js
 * Mithril component for a colorselector tool.
 *
 */
import m from 'mithril'
export class ColorPicker {
  view() {
    // store these bounds, for checking in drawLazily()
    let selectedClass = this.selected ? 'selected' : '';
    return  m('div', [m(new BaseSelector()),m(new SaturationSelector())]);
  }
}

export class BaseSelector {
  oncreate(vnode) {
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    // TODO: remove this development assistive method
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
		ctx.fillStyle = 'maroon';
		console.log('testing?',ctx.fillStyle,hexToRgb(ctx.fillStyle),
			rgbToHsv(hexToRgb(ctx.fillStyle)),
			hsvToRgb(rgbToHsv(hexToRgb(ctx.fillStyle)))
		);
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

    var vGrad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.strokeStyle='black';
    ctx.lineWidth=1;
    ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);
  }
	
}

export class SaturationSelector {
  oncreate(vnode) {
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.draw();
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    // TODO: remove this development assistive method
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
		ctx.fillStyle = 'rgb(0,0,0)';
		console.log('testing?',ctx.fillStyle);
    var grad = ctx.createLinearGradient(0, 0, 0,this.canvas.height);
    grad.addColorStop(0 , '#F00');
		grad.addColorStop(1, 'rgba(255,255,255,1');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.strokeStyle='black';
		ctx.lineWidth=1;
		ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);
    // store these bounds, for checking in drawLazily()
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
