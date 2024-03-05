/**
 * A mithril component for map removal dialog
 */
import m from 'mithril';

export class ExportImageDialog {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   * @param vnode
   */

  oninit(vnode) {
    this.model = vnode.attrs.model;
    this.onDismiss = vnode.attrs.onDismiss;
    DownloadData.new = false;
    DownloadData.setName('');
    DownloadData.file = '';
    this.selection = 'png';
  }

  /**
   * event handler for cancel button.
   * @param evt
   * @private
   */

  _onCancel(evt) {
    evt.preventDefault();
    this.onDismiss(evt);
  }

  /**
   * event handler for export image button
   * @param evt
   * @private
   */

  _onExport(evt) {
    //TODO: Update to deal with labels

    let test = Array.from(document.getElementsByClassName('cmap-canvas'));
    let width = 0;
    let height = 0;
    //figure out max height/width for tmp canvas
    test.forEach(canvas => {
      let testWidth = parseInt(canvas.style.left)+parseInt(canvas.style.width);
      let testHeight = parseInt(canvas.style.height);
      width = width > testWidth ? width : testWidth;
      height = height > testHeight ? height : testHeight;
    });
    // create tmp canvas to draw canvas elements on.
    const tmpCvs = document.createElement('canvas');
    const ctx = tmpCvs.getContext('2d');
    tmpCvs.height = height;
    tmpCvs.width = width;
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,tmpCvs.width,tmpCvs.height);

    // put new canvas images on meta canvas.
    test.forEach(canvas =>{
      ctx.drawImage(canvas,parseInt(canvas.style.left),0);
    });

    //open rendered image in newWindow
    let dl = document.createElement('a');
    let image = tmpCvs.toDataURL(`image/${DownloadData.format}`);
    dl.setAttribute('href',image);
    let name = DownloadData.newName || DownloadData.loc;
    dl.setAttribute('download', `${name}.${DownloadData.format}`);

    //window.open(image,'cmap.png','title=yes');
    evt.preventDefault();
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    this.onDismiss(evt);
  }

  /**
   * event handler for radio button change.
   * @param evt
   * @param map
   * @private
   */

  _onSelection(evt, format) {
    evt.preventDefault();
    this.selection = format;
    DownloadData.setFormat(this.selection);
  }

  view() {
    return m('div.cmap-map-addition-dialog', [
      m('h5', 'Export Image'),
      m('p', 'Export current view as a png image.'),
      m('form', [
        m('table.u-full-width', [
          m('thead', [
            m('tr', [m('th', 'File Name'), m('th', m('input[type=text]', {
              oninput: (e) => DownloadData.setLoc(e.target.value),
              value: DownloadData.loc,
              style: 'width:60%;',
              placeholder: 'cmapimage'
            }))])
          ]),
          m('tbody',
            m('tr', [
              m('td', 'Export As'),
              m('td', [
                m('label', [
                  m('input[type="radio"]', {
                    name: 'png',
                    checked: this.selection === 'png',
                    value: 'png',
                    onchange: (evt) => this._onSelection(evt, 'png')
                  }),
                  m('span[class="label-body"]', 'png')
                ]),
                m('label', [
                  m('input[type="radio"]', {
                    name: 'tiff',
                    checked: this.selection === 'tiff',
                    value: 'tiff',
                    onchange: (evt) => this._onSelection(evt, 'tiff')
                  }),
                  m('span[class="label-body"]', 'tiff')
                ]),
                m('label', [
                  m('input[type="radio"]', {
                    name: 'jpg',
                    checked: this.selection === 'jpg',
                    value: 'jpg',
                    onchange: (evt) => this._onSelection(evt, 'jpg')
                  }),
                  m('span[class="label-body"]', 'jpg')
                ])
              ])
            ])
          )
        ])
      ]),
      m('button', {
          //disabled unless a selection is made, or a new set is selected *and* there is a location or file state)
//          disabled: !((this.selection || UploadData.new) && (UploadData.loc !== '' || UploadData.file !== '')),
          class: this.selection || DownloadData.new ? 'button-primary' : 'button',
          onclick: evt => this._onExport(evt)
        }, [
          m('i.material-icons', 'get_app'),
          'Export Image'
        ]
      ),
      m('button.button', {onclick: evt => this._onCancel(evt)}, [
        m('i.material-icons', 'cancel'),
        'Cancel'
      ])
    ]);
  }
}

/**
 *
 * @type {{loc: string, file: string, newName: string, new: boolean, setLoc: DownloadData.setLoc, setName: DownloadData.setName, setFile: DownloadData.setFile, toggleNew: DownloadData.toggleNew}}
 */

let DownloadData = {
  loc: 'cmapImage',
  file: '',
  newName: '',
  format: 'png',
  setLoc: function (value) {
    DownloadData.loc = value;
  },
  setName: function (value) {
    DownloadData.newName = value;
  },
  setFormat: function (format) {
    DownloadData.format = format;
  }
};

