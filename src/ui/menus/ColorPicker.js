/**
 * ColorPicker.js
 * Mithril component for a colorselector tool.
 *
 */
import m from 'mithril';
import PubSub from 'pubsub-js';

import {pageToCanvas} from '../../util/CanvasUtil';

/**
 *
 * @type {{oninit: ColorPicker.oninit, onupdate: ColorPicker.onupdate, view: ColorPicker.view}}
 */
export let ColorPicker = {
  /**
   *
   * @param vnode
   */

  oninit: function (vnode) {
    vnode.state = vnode.attrs;
    vnode.state.colors = {
      baseColor: vnode.attrs.settings.trackColor[vnode.attrs.order] || 'red',
      currentColor: null,
      hueValueColor: null
    };
  },

  /**
   *
   * @param vnode
   */

  onupdate: function (vnode) {
    vnode.attrs.settings.trackColor[vnode.attrs.order] = vnode.state.colors.baseColor;
  },

  /**
   *
   * @param vnode
   * @returns {*[]}
   */

  view: function (vnode) {
    // store these bounds, for checking in drawLazily()
    return [m('div.color-picker', {style: `display:${vnode.state.hidden[vnode.state.order]}`}, [
      m(BaseSelector, {info: vnode.state}),
      m(SaturationSelector, {info: vnode.state}),
      m(ColorPreview, {info: vnode.state}),
      m('div#color-apply-controls', {style: 'text-align:center; margin-left:10px; display:inline-block; padding:auto'},
        [m(ColorBox, {info: vnode.state}),//,settings:vnode.attrs.settings}),
          m(ColorApplyButton, {info: vnode.state, settings: vnode.state.settings}),
          m(ColorResetButton, {info: vnode.state})
        ]
      )
    ])
    ];
  }
};
/**
 *
 * @type {{oncreate: BaseSelector.oncreate, onupdate: BaseSelector.onupdate, view: BaseSelector.view, draw: BaseSelector.draw, handleGesture: BaseSelector.handleGesture, _locationChange: BaseSelector._locationChange, _changeColor: BaseSelector._changeColor, _posFromHsv: BaseSelector._posFromHsv, _hsvFromPos: BaseSelector._hsvFromPos}}
 */

export let BaseSelector = {

  /**
   *
   * @param vnode
   */

  oncreate: function (vnode) {
    vnode.dom.mithrilComponent = this;
    this.vnode = vnode;
    vnode.state = vnode.attrs;
    vnode.state.canvas = this.el = vnode.dom;
    vnode.state.context2d = vnode.dom.getContext('2d');
    if (!vnode.state.info.currentColor || !vnode.state.info.hueValueColor) {
      vnode.state.context2d.fillStyle = vnode.state.info.colors.baseColor;
      //use the context to convert the original color into a hex string
      //avoiding needing to parse html color words
      vnode.state.info.colors.baseColor = vnode.state.context2d.fillStyle;
      vnode.state.info.colors.currentColor = vnode.state.context2d.fillStyle;
      vnode.state.info.colors.hueValueColor = rgbToHsv(hexToRgb(vnode.state.context2d.fillStyle));
    }
    vnode.state.ptrPos = this._posFromHsv(vnode.state.info.colors.hueValueColor);
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    };
    this.draw();
  },

  /**
   * mithril lifecycle method
   * @param vnode
   */

  onupdate: function (vnode) {
    vnode.state.ptrPos = vnode.dom.mithrilComponent._posFromHsv(vnode.state.info.colors.hueValueColor);
    vnode.dom.mithrilComponent.draw();
  },

  /**
   *
   * @returns {*}
   */

  view: function () {
    // store these bounds, for checking in drawLazily()
    return m('canvas', {
      class: 'color-canvas-main',
      style: 'width: 200; height: 100;',
      width: 200,
      height: 100
    });
  },

  /**
   *
   */

  draw: function () {
    let canvas = this.vnode.state.canvas;
    let ctx = this.vnode.state.context2d;
    let ptrPos = this.vnode.state.ptrPos;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // RGB gradient
    let hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    hGrad.addColorStop(0 / 6, '#F00');
    hGrad.addColorStop(1 / 6, '#FF0');
    hGrad.addColorStop(2 / 6, '#0F0');
    hGrad.addColorStop(3 / 6, '#0FF');
    hGrad.addColorStop(4 / 6, '#00F');
    hGrad.addColorStop(5 / 6, '#F0F');
    hGrad.addColorStop(6 / 6, '#F00');
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Fade to black gradient
    let vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vGrad;

    // Draw the selection pointer
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptrPos.x - 10, ptrPos.y);
    ctx.lineTo(ptrPos.x - 3, ptrPos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(ptrPos.x - 3, ptrPos.y);
    ctx.lineTo(ptrPos.x - 1, ptrPos.y);
    ctx.moveTo(ptrPos.x + 1, ptrPos.y);
    ctx.lineTo(ptrPos.x + 3, ptrPos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(ptrPos.x + 3, ptrPos.y);
    ctx.lineTo(ptrPos.x + 10, ptrPos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ptrPos.x, ptrPos.y - 10);
    ctx.lineTo(ptrPos.x, ptrPos.y - 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(ptrPos.x, ptrPos.y - 3);
    ctx.lineTo(ptrPos.x, ptrPos.y - 1);
    ctx.moveTo(ptrPos.x, ptrPos.y + 1);
    ctx.lineTo(ptrPos.x, ptrPos.y + 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(ptrPos.x, ptrPos.y + 3);
    ctx.lineTo(ptrPos.x, ptrPos.y + 10);
    ctx.stroke();
  },

  /**
   *
   * @param evt
   * @returns {boolean}
   */

  handleGesture: function (evt) {
    if (evt.type.match(this._gestureRegex.tap) ||
      evt.type.match(this._gestureRegex.pan)) {
      let point = pageToCanvas(evt, this.vnode.state.canvas);
      this._locationChange(point);
    }
    return true;
  },

  /**
   *
   * @param evt
   * @private
   */

  _locationChange: function (evt) {
    let hueValue = this.vnode.state.info.colors.hueValueColor;
    this.vnode.state.ptrPos = {
      x: evt.x,
      y: evt.y
    };
    let hsv = this._hsvFromPos(this.vnode.state.ptrPos);
    hueValue[0] = hsv[0];
    hueValue[2] = hsv[2];
    if (!hueValue[1]) {
      hueValue[1] = 100;
    }
    this._changeColor();
  },
  /**
   *
   * @private
   */

  _changeColor: function () {
    //PubSub to alert the Saturation slider that the position has changed
    //order is passed to not update *every* color selector
    //Can be removed, but using PubSub means dynamic response from other forms
    PubSub.publish('hueValue', {color: this.vnode.state.colors, order: this.vnode.state.info.order});
    this.draw();
  },

  /**
   *
   * @param hsv
   * @returns {{x: number, y: number}}
   * @private
   */

  _posFromHsv: function (hsv) {
    // Math.round to avoid annoying sub-pixel rendering
    hsv[0] = Math.max(0, Math.min(360, hsv[0]));
    hsv[2] = Math.max(0, Math.min(100, hsv[2]));
    return {
      x: parseFloat(hsv[0] / 360) * (this.vnode.state.canvas.width),
      y: (1 - (hsv[2] / 100)) * (this.vnode.state.canvas.height)
    };
  },

  /**
   *
   * @param pos
   * @returns {*[]}
   * @private
   */

  _hsvFromPos: function (pos) {
    let h = Math.max(0, (pos.x * 360) / this.vnode.state.canvas.width);
    let s = 100;
    let l = 100 * (1 - (pos.y / this.vnode.state.canvas.height));
    return [h, s, l];
  }
};
/**
 *
 * @type {{oncreate: SaturationSelector.oncreate, onupdate: SaturationSelector.onupdate, view: SaturationSelector.view, draw: SaturationSelector.draw, handleGesture: SaturationSelector.handleGesture, _changeColor: SaturationSelector._changeColor, _hueUpdated: SaturationSelector._hueUpdated, _posFromHsv: SaturationSelector._posFromHsv, _sFromPos: SaturationSelector._sFromPos}}
 */

export let SaturationSelector = {
  /**
   *
   * @param vnode
   */

  oncreate: function (vnode) {
    vnode.dom.mithrilComponent = this;
    this.vnode = vnode;
    vnode.state = vnode.attrs;
    vnode.state.canvas = this.el = vnode.dom;
    vnode.state.context2d = vnode.dom.getContext('2d');
    if (!vnode.state.info.colors.hueValueColor[1]) {
      vnode.context2d.fillStyle = vnode.state.info.colors.baseColor;
      //use the context to convert the original color into a hex string
      //avoiding needing to parse html color words
      vnode.state.info.colors.hueValueColor[1] = rgbToHsv(hexToRgb(vnode.state.context2d.fillStyle))[1];
    }
    vnode.state.ptrPos = this._posFromHsv(vnode.state.info.colors.hueValueColor);
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    };
    PubSub.subscribe('hueValue', (msg, data) => {
      if (data.order === vnode.state.info.order) this._hueUpdated(data.color);
    });
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      tap: new RegExp('^tap')
    };
    this.draw();
  },

  /**
   *
   * @param vnode
   */

  onupdate: function (vnode) {
    vnode.state.ptrPos = vnode.dom.mithrilComponent._posFromHsv(vnode.state.info.colors.hueValueColor);
    PubSub.publish('satUpdated', {order: vnode.state.info.order, currentColors: vnode.state.info.colors}); // keeps hex value in sync
    vnode.dom.mithrilComponent.draw();
  },

  /**
   * mithril component render method
   * @returns {*}
   */

  view: function () {
    // store these bounds, for checking in drawLazily()
    return m('canvas', {
      class: 'color-canvas-sat',
      style: 'margin-left:10px; width: 20; height: 100;',
      width: 20,
      height: 100
    });
  },

  /**
   *
   */

  draw: function () {
    let canvas = this.vnode.state.canvas;
    let ctx = this.vnode.state.context2d;
    let ptrPos = this.vnode.state.ptrPos;
    // clear and redraw gradient slider for current picked HueValue color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    let hueValueColor = this.vnode.state.info.colors.hueValueColor;
    let rgbStart = hsvToRgb([hueValueColor[0], 100, hueValueColor[2]]).map(color => {
      return Math.floor(color);
    });
    let rgbStop = hsvToRgb([hueValueColor[0], 0, hueValueColor[2]]).map(color => {
      return Math.floor(color);
    });
    grad.addColorStop(0, `rgba(${rgbStart[0]},${rgbStart[1]},${rgbStart[2]},1)`);
    grad.addColorStop(1, `rgba(${rgbStop[0]},${rgbStop[1]},${rgbStop[2]},1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw slider pointer
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(canvas.width, ptrPos + 5);
    ctx.lineTo(canvas.width / 2, ptrPos);
    ctx.lineTo(canvas.width, ptrPos - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  /**
   *
   * @param evt
   * @returns {boolean}
   */

  handleGesture: function (evt) {
    if (evt.type.match(this._gestureRegex.tap) ||
      evt.type.match(this._gestureRegex.pan)) {
      var point = pageToCanvas(evt, this.vnode.state.canvas);
      this._changeColor(point);
    }
    return true;
  },

  /**
   *
   * @param evt
   * @private
   */

  _changeColor: function (evt) {
    this.vnode.state.ptrPos = evt.y;
    this.vnode.state.info.colors.hueValueColor[1] = this._sFromPos(this.vnode.state.ptrPos);
    this._hueUpdated(this.vnode.state.info.colors);
  },

  /**
   *
   * @private
   */

  _hueUpdated: function () {
    PubSub.publish('satUpdated', {order: this.vnode.state.info.order, currentColors: this.vnode.state.info.colors});
    this.draw();
  },

  /**
   *
   * @param hsv
   * @returns {number}
   * @private
   */

  _posFromHsv: function (hsv) {
    return Math.round((1 - (hsv[1] / 100)) * this.vnode.state.canvas.height);
  },

  /**
   *
   * @param pos
   * @returns {number}
   * @private
   */

  _sFromPos: function (pos) {
    return 100 * (1 - (pos / this.vnode.state.canvas.height));
  }
};

/**
 *
 * @type {{oncreate: ColorPreview.oncreate, onupdate: ColorPreview.onupdate, view: ColorPreview.view, draw: ColorPreview.draw}}
 */

export let ColorPreview = {

  /**
   *
   * @param vnode
   */

  oncreate: function (vnode) {
    this.order = vnode.attrs.info.order;
    this.colors = vnode.attrs.info.colors;
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    PubSub.subscribe('satUpdated', (msg, data) => {
      if (this.order === data.order) {
        let fillColor = hsvToRgb(data.currentColors.hueValueColor).map(color => {
          return Math.floor(color);
        });
        this.context2d.fillStyle = `rgba(${fillColor[0]},${fillColor[1]},${fillColor[2]},1)`;
        this.colors.currentColor = this.context2d.fillStyle;
        this.draw();
      }
    });
    this.draw();
  },

  /**
   * mithril lifecycle method
   *
   */

  onupdate: function () {
    this.draw();
  },

  /**
   * mithril component render method
   * @returns {*}
   */

  view: function () {
    return m('canvas#color-canvas-preview', {
      style: 'margin-left:10px; width: 20; height: 100;',
      width: 20,
      height: 100
    });
  },

  /**
   *
   */

  draw: function () {
    let ctx = this.context2d;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.colors.currentColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

/**
 * Use currently selected color
 * @type {{view: ColorApplyButton.view}}
 */

export let ColorApplyButton = {

  /**
   * mithril component render method
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    // store these bounds, for checking in drawLazily()
    return m('button.approve-button', {
      style: 'display:block; width:100%;',
      onclick: () => {
        vnode.attrs.info.colors.baseColor = vnode.attrs.info.colors.currentColor;
        vnode.attrs.info.colors.hueValueColor = rgbToHsv(hexToRgb(vnode.attrs.info.colors.baseColor));
        vnode.attrs.settings.nodeColor[vnode.attrs.info.order] = vnode.attrs.info.colors.baseColor;
        PubSub.publish('satUpdated', {order: vnode.attrs.info.order, currentColors: vnode.attrs.info.colors});
      }
    }, 'Apply');
  }
};

/**
 * Reset color to prior
 * @type {{view: ColorResetButton.view}}
 */

export let ColorResetButton = {

  /**
   * mithril component render method
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    // store these bounds, for checking in drawLazily()
    return m('button.reset-button', {
      style: 'display:block; width:100%',
      onclick: () => {
        vnode.attrs.info.colors.currentColor = vnode.attrs.info.colors.baseColor;
        vnode.attrs.info.colors.hueValueColor = rgbToHsv(hexToRgb(vnode.attrs.info.colors.baseColor));
        PubSub.publish('satUpdated', {order: vnode.attrs.info.order, currentColors: vnode.attrs.info.colors});
      }
    }, 'Reset');
  }
};

/**
 * Text Box to find color
 * @type {{oninit: ColorBox.oninit, view: ColorBox.view, handleGesture: ColorBox.handleGesture}}
 */

export let ColorBox = {

  /**
   *
   * @param vnode
   */

  oninit: function (vnode) {
    this.canvas = this.el = vnode.dom;
    this.order = vnode.attrs.info.order;
    vnode.state.value = vnode.attrs.info.colors.currentColor;
    PubSub.subscribe('satUpdated', (msg, data) => {
      if (this.order === data.order) {
        vnode.dom.value = vnode.attrs.info.colors.currentColor;
      }
    });
  },

  /**
   * mithril component render method
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    // store these bounds, for checking in drawLazily()
    return m('input[type=text].color-input', {
      style: 'display:block; width:100%;',
      oninput: m.withAttr('value', function (value) {
        try {
          let code = value.match(/^#?([a-f\d]*)$/i);
          let str = code[1];
          if (code[1].length === 3) {
            str = `#${str[0]}${str[0]}${str[1]}${str[1]}${str[2]}${str[2]}`;
          }
          vnode.attrs.info.colors.currentColor = value;
          vnode.attrs.info.colors.hueValueColor = rgbToHsv(hexToRgb(str));
        } catch (e) {
          // expect this to fail silently, as most typing will not actually give
          // a proper hex triplet/sextet
        }
      })
    });
  },

  /**
   *
   * @returns {boolean}
   */

  handleGesture: function () {
    return true;
  }
};

/**
 * convert hex triplet to RGB
 * #FFFFFF ->[0-255,0-255,0-255]
 * @param hex
 * @returns {*[]}
 */

export function hexToRgb(hex) {
  var result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

/**
 *  convert RGB priplet to hex
 * [0-255,0-255,0-255] -> #FFFFFF
 * @param rgb
 * @returns {string}
 */

export function rgbToHex(rgb) {
  return (
    (0x100 | Math.round(rgb[0])).toString(16).substr(1) +
    (0x100 | Math.round(rgb[1])).toString(16).substr(1) +
    (0x100 | Math.round(rgb[2])).toString(16).substr(1)
  );
}

/**
 * Convert RGB triplet ot HSV
 * [0-255,0-255,0-255] -> [0-360,0-100,0-100]
 * @param rgb
 * @returns {*[]}
 */

export function rgbToHsv(rgb) {
  //make sure RGB values are within 0-255 range
  //and convert to decimal
  rgb = rgb.map(component => {
    return Math.max(0, Math.min(255, component)) / 255;
  });

  // Conversion from RGB -> HSV colorspace

  let cmin = Math.min(Math.min(rgb[0], rgb[1]), rgb[2]);
  let cmax = Math.max(Math.max(rgb[0], rgb[1]), rgb[2]);
  let delta = parseFloat(cmax - cmin);
  let hue = 0;
  if (delta === 0) {
    hue = 0;
  } else if (cmax === rgb[0]) {
    hue = 60 * (((rgb[1] - rgb[2]) / delta));
  } else if (cmax === rgb[1]) {
    hue = 60 * (((rgb[2] - rgb[0]) / delta) + 2);
  } else if (cmax === rgb[2]) {
    hue = 60 * (((rgb[0] - rgb[1]) / delta) + 4);
  }
  if (hue < 0) hue += 360;
  let sat = cmax === 0 ? 0 : (delta / cmax) * 100;
  let value = cmax * 100;

  return [hue, sat, value];
}

/**
 * Convert from HSV to RGB
 * [0-360,0-100,0-100] -> [0-255,0-255,0-255]
 * @param hsv
 * @returns {*[]}
 */

export function hsvToRgb(hsv) {
  let u = 255 * (hsv[2] / 100);
  let h = hsv[0] / 60;
  let s = hsv[1] / 100;

  let i = Math.floor(h);
  if (i < 0) i = 0;
  let f = i % 2 ? h - i : 1 - (h - i);
  let m = u * (1 - s);
  let n = u * (1 - s * f);
  switch (i) {
    case 6:
    case 0:
      return [u, n, m];
    case 1:
      return [n, u, m];
    case 2:
      return [m, u, n];
    case 3:
      return [m, n, u];
    case 4:
      return [n, m, u];
    case 5:
      return [u, m, n];
  }
}
