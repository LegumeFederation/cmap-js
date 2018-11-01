/**
 *
 * Base Component, placeholder for other canvas dataSourceComponents
 *
 */

import {h, Component} from 'preact';
import GestureWrapper from '../Gesture';

export default class ExportDialog extends Component {

  constructor() {
    super();
    this.state = {
      format: 'png',
      location: '',
      isOpen: true
    };
  }

  componentWillReceiveProps() {
    if (!this.state.isOpen) this.toggleOpen();
  }

  genFormatSelection() {
    return ['png', 'tiff', 'jpg'].map(format => {
      return (
        <label>
          <input
            type={'radio'}
            name={format}
            value={format}
            checked={this.state.format === format}
            onChange={(evt) => {
              this.onSelection(evt, format);
            }}
          />
          <span class={'label-body'}> {format} </span>
        </label>
      );
    });
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onSelection(evt, format) {
    evt.preventDefault();
    this.setState({format: format});
  }

  onInput(evt) {
    this.setState({location: evt.srcElement.value});
  }

  onExport(evt) {
    evt.preventDefault();
    let cmapCanvases = Array.from(document.getElementsByClassName('cmap-canvas'));
    let width = 0;
    let height = 0;
    //figure out max height/width for tmp canvas
    cmapCanvases.forEach(canvas => {
      let testWidth = parseInt(canvas.offsetLeft) + parseInt(canvas.offsetWidth);
      let testHeight = parseInt(canvas.offsetHeight);
      width = width > testWidth ? width : testWidth;
      height = height > testHeight ? height : testHeight;
    });
    // create tmp canvas to draw canvas elements on.
    const tmpCvs = document.createElement('canvas');
    const ctx = tmpCvs.getContext('2d');
    tmpCvs.height = height;
    tmpCvs.width = width;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, tmpCvs.width, tmpCvs.height);

    // put new canvas images on meta canvas.
    cmapCanvases.forEach(canvas => {
      ctx.drawImage(canvas, parseInt(canvas.offsetLeft), 0);
    });

    //open rendered image in newWindow
    let dl = document.createElement('a');
    let format = this.state.format;
    let image = tmpCvs.toDataURL(`image/${format}`);
    dl.setAttribute('href', image);
    let name = this.state.location || 'cmapimage';
    dl.setAttribute('download', `${name}.${format}`);
    //window.open(image,'cmap.png','title=yes');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
  }

  render({appState, maxHeight}, {location, isOpen}) {
    // store these bounds, for checking in drawLazily()
    let formatSelector = this.genFormatSelection();

    let exportModal = (
      <div class={'twelve columns control-dialog'} id={'cmap-map-addition-dialog'} style={{maxHeight: (maxHeight)}}>
        <h5> Export Image</h5>
        <p> Export current view as an image. </p>
        <form class={'twelve-columns'} style={{maxHeight: maxHeight * .30, overflowY: 'auto'}}>
          <thead>
          <tr>
            <th> Export as Image</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td> File Name:</td>
            <td>
              <input
                id={'export-location-input'}
                type={'text'}
                placeholder={'cmapimage'}
                onInput={() => {
                  this.onInput();
                }}
                value={location}
              />
            </td>
          </tr>
          <tr>
            <td> Image Format:</td>
            <td>
              {formatSelector}
            </td>
          </tr>
          </tbody>
        </form>
        <div class={'cmap-modal-control'}>
          <button
            class={'button'}
            onClick={(evt) => this.onExport(evt)}
          >
            <div>
              <i class={'material-icons'}> get_app </i>
              <span> Export Image </span>
            </div>
          </button>
          <button
            class={'button'}
            onClick={() => this.toggleOpen()}
          >
            <i class={'material-icons'}> cancel </i>
            <span> Close Menu </span>
          </button>
        </div>
      </div>
    );

    return (isOpen && exportModal);
  }
}

