/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */
import {h, Component} from 'preact';
import GestureWrapper from '../../Gesture';

export default class FeatureEditorComponent extends Component {

  constructor() {
    super();
    this.state = {
      selected: '',
      baseColor: '',
      newColor: '',
      hueValColor: '',
      hueValCanvas: '',
      satCanvas: '',
      previewCanvas: '',
      hueValPos: {x: 0, y: 0},
      satPos: 0,
      hueValueWidth: 10,
      canvasHeight: 10
    };
    this.onFilterChange = this.onFilterChange.bind(this);
    this.satLocationChange = this.satLocationChange.bind(this);
    this.hueValLocationChange = this.hueValLocationChange.bind(this);
    this.onManualColor = this.onManualColor.bind(this);
    this.resetColor = this.resetColor.bind(this);
    this.setFeature = this.setFeature.bind(this);
    this.removeFeature = this.removeFeature.bind(this);
  }

  componentWillMount() {
    this.setState({
      selected: this.props.initialSelection,
      selectedIndex: this.props.tagList.indexOf(this.props.initialSelection),
      hueValCanvas: this.hueValCanvasComponent(),
      satCanvas: this.saturationCanvasComponent(),
      previewCanvas: this.previewCanvasComponent()
    });
  }

  componentDidMount() {
    let hvc = this.base.children[1].children[0];
    let hvctx = hvc.getContext('2d');
    let sc = this.base.children[1].children[1];
    hvctx.fillStyle = this.props.baseColor;
    let hvcol = this.rgbToHsv(this.hexToRgb(hvctx.fillStyle));
    let calcWidth = Math.floor(this.base.offsetWidth * .25);
    let calcHeight = this.base.children[1].children[3].offsetHeight;
    hvc.height = calcHeight;
    hvc.width = calcWidth;
    sc.height = calcHeight;
    this.base.children[1].children[2].height = calcHeight;
    this.setState({
      baseColor: hvctx.fillStyle,
      newColor: hvctx.fillStyle,
      hueValColor: hvcol,
      hueValPos: this.hueValPosFromHsv(hvcol, hvc),
      satPos: this.satPosFromHSV(hvcol, sc),
      canvasHeight: this.base.children[1].children[3].offsetHeight,
      hueValueWidth: Math.floor(this.base.offsetWidth * .25)
    });

    this.redrawCanvases();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.baseColor !== this.state.baseColor) {
      this.setState({baseColor: nextProps.baseColor});
    }
  }

  componentDidUpdate() {
    this.redrawCanvases();
  }

  redrawCanvases() {
    this.drawHVCanvas(this.base.children[1].children[0]);
    this.drawSCanvas(this.base.children[1].children[1]);
    this.drawPCanvas(this.base.children[1].children[2]);
  }

  onFilterChange(evt) {
    let idx = evt.target.selectedIndex;
    this.setState({
      selectedIndex: idx,
      selected: this.props.tagList[idx]
    });
  }

  /**
   * Convert RGB triplet ot HSV
   * [0-255,0-255,0-255] -> [0-360,0-100,0-100]
   * @param rgb
   * @returns {*[]}
   */
  hexToRgb(hex) {
    let result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  }

  /**
   *  convert RGB triplet to hex
   * [0-255,0-255,0-255] -> #FFFFFF
   * @param rgb
   * @returns {string}
   */

  rgbToHex(rgb) {
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

  rgbToHsv(rgb) {
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

  hsvToRgb(hsv) {
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

  hueValCanvasComponent() {
    let hOptions = {
      recognizers: {
        pan: {
          threshold: 1
        }
      }
    };
    return (
      <GestureWrapper
        onTap={this.hueValLocationChange}
        onPan={this.hueValLocationChange}
        options={hOptions}
      >
        <canvas
          class={'color-canvas-main'}
          width={this.state.hueValueWidth}
          height={this.state.canvasHeight}
          style={{paddingRight: '1em'}}
        />
      </GestureWrapper>
    );
  }

  saturationCanvasComponent() {
    let hOptions = {
      recognizers: {
        pan: {
          threshold: 1
        }
      }
    };

    return (
      <GestureWrapper
        onTap={this.satLocationChange}
        onPan={this.satLocationChange}
        options={hOptions}
      >
        <canvas
          class={'color-canvas-sat'}
          width={20}
          height={this.state.canvasHeight}
          style={{paddingRight: '1em'}}
        />
      </GestureWrapper>
    );
  }

  previewCanvasComponent() {
    return (
      <canvas
        class={'color-canvas-preview'}
        width={20}
        height={this.state.canvasHeight}
        style={{paddingRight: '1em'}}
      />
    );
  }

  hueValLocationChange(evt) {
    if (evt.srcEvent) evt = evt.srcEvent;
    if (evt.target !== this.base.children[1].children[0]) return;
    let hueValue = this.state.hueValColor.slice();
    let ptrPos = {
      x: evt.layerX,
      y: evt.layerY
    };
    let hsv = this.hueValHSFromPos(ptrPos, evt.target);
    hueValue[0] = hsv[0];
    hueValue[2] = hsv[2];
    if (!hueValue[1]) {
      hueValue[1] = 100;
    }

    this.setState({
      hueValPos: ptrPos,
      hueValColor: hueValue
    });

  }

  hueValPosFromHsv(hsv, cvs) {
    // Math.round to avoid annoying sub-pixel rendering
    hsv[0] = Math.max(0, Math.min(360, hsv[0]));
    hsv[2] = Math.max(0, Math.min(100, hsv[2]));
    return {
      x: parseFloat(hsv[0] / 360) * (cvs.width),
      y: (1 - (hsv[2] / 100)) * (cvs.height)
    };
  }

  hueValHSFromPos(pos, cvs) {
    let h = Math.max(0, (pos.x * 360) / cvs.width);
    let s = 100;
    let l = 100 * (1 - (pos.y / cvs.height));
    return [h, s, l];
  }

  satLocationChange(evt) {
    if (evt.srcEvent) evt = evt.srcEvent;
    if (evt.target !== this.base.children[1].children[1]) return;
    let hvcolor = this.state.hueValColor;
    let yPos = evt.layerY <= 0 ? 0 : evt.layerY >= evt.target.offsetHeight ? evt.target.offsetHeight : evt.layerY;
    hvcolor[1] = this.satSFromPos(yPos, evt.target);
    this.setState({
      satPos: yPos,
      hueValColor: hvcolor,
    });
  }

  satPosFromHSV(hsv, cvs) {
    return Math.round((1 - (hsv[1] / 100)) * cvs.height);
  }

  satSFromPos(pos, cvs) {
    return 100 * (1 - (pos / cvs.height));
  }

  drawHVCanvas(cvs) {
    let ctx = cvs.getContext('2d');
    let ptrPos = this.state.hueValPos;

    //reset canvas
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    // RGB gradient
    let hGrad = ctx.createLinearGradient(0, 0, cvs.width, 0);
    hGrad.addColorStop(0 / 6, '#F00');
    hGrad.addColorStop(1 / 6, '#FF0');
    hGrad.addColorStop(2 / 6, '#0F0');
    hGrad.addColorStop(3 / 6, '#0FF');
    hGrad.addColorStop(4 / 6, '#00F');
    hGrad.addColorStop(5 / 6, '#F0F');
    hGrad.addColorStop(6 / 6, '#F00');
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    //Fade to black gradient
    let vGrad = ctx.createLinearGradient(0, 0, 0, cvs.height);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vGrad;

    // Draw the selection pointer
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cvs.width, cvs.height);
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
  }

  drawSCanvas(cvs) {
    let ctx = cvs.getContext('2d');
    let ptrPos = this.state.satPos;
    // clear and redraw gradient slider for current picked HueValue color;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let grad = ctx.createLinearGradient(0, 0, 0, cvs.height);
    let hueValueColor = this.state.hueValColor;
    let rgbStart = this.hsvToRgb([hueValueColor[0], 100, hueValueColor[2]]).map(color => {
      return Math.floor(color);
    });
    let rgbStop = this.hsvToRgb([hueValueColor[0], 0, hueValueColor[2]]).map(color => {
      return Math.floor(color);
    });
    grad.addColorStop(0, `rgba(${rgbStart[0]},${rgbStart[1]},${rgbStart[2]},1)`);
    grad.addColorStop(1, `rgba(${rgbStop[0]},${rgbStop[1]},${rgbStop[2]},1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // draw slider pointer
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(cvs.width, ptrPos + 5);
    ctx.lineTo(cvs.width / 2, ptrPos);
    ctx.lineTo(cvs.width, ptrPos - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawPCanvas(cvs) {
    let ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let rgb = this.hsvToRgb(this.state.hueValColor);
    ctx.fillStyle = `#${this.rgbToHex(rgb)}`;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cvs.width, cvs.height);
    if (this.state.newColor !== ctx.fillStyle) {
      this.setState({newColor: ctx.fillStyle});
    }
  }

  onManualColor(evt) {
    try {
      let value = evt.srcElement.value;
      let code = value.match(/^#?([a-f\d]*)$/i);
      let str = code[1];
      if (code[1].length === 3) {
        str = `#${str[0]}${str[0]}${str[1]}${str[1]}${str[2]}${str[2]}`;
      }
      this.setState({
        newColor: value,
        hueValColor: this.rgbToHsv(this.hexToRgb(str))
      });
    } catch (e) {
      return;
    }
  }

  resetColor() {
    let hvc = this.base.children[1].children[0];
    let hvctx = hvc.getContext('2d');
    let sc = this.base.children[1].children[1];
    hvctx.fillStyle = this.props.baseColor;
    let hvcol = this.rgbToHsv(this.hexToRgb(hvctx.fillStyle));
    this.setState({
      baseColor: hvctx.fillStyle,
      newColor: hvctx.fillStyle,
      hueValColor: hvcol,
      hueValPos: this.hueValPosFromHsv(hvcol, hvc),
      satPos: this.satPosFromHSV(hvcol, sc)
    });
    this.redrawCanvases();
  }

  setFeature() {
    this.props.setFeature(this.state.selected, this.state.newColor, this.props.index);
  }

  removeFeature() {
    this.props.removeFeature(this.props.index);
  }

  render(props, state) {
    // store these bounds, for checking in drawLazily()
    return (
      <div class={'row'}>
        <select
          style={{display: 'block', marginTop: '2rem'}}
          onInput={this.onFilterChange}
        >
          {props.tagList.map((option) => <option selected={option === state.selected}> {option} </option>)}
        </select>
        <div
          class='twelve columns'
          id={'horizontal-layout-container'}
        >
          {state.hueValCanvas}
          {state.satCanvas}
          {state.previewCanvas}
          <div style={{display: 'inline-block'}}>
            <input
              id={'color-input'}
              type={'text'}
              onInput={this.onManualColor}
              value={state.newColor}
              style={{width: '8rem'}}
            />
            <button
              class={'color-select-ctrl'}
              style={{
                background: state.newColor
              }}
              onClick={this.setFeature}
            >
              Apply
            </button>
            <button
              class={'color-select-ctrl'}
              style={{
                background: props.baseColor
              }}
              onClick={this.resetColor}
            >
              Reset
            </button>
            <button
              class={'color-select-ctrl'}
              onClick={this.removeFeature}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );

  }
}


