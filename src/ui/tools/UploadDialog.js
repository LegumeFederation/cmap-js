/**
 * A mithril component for map removal dialog
 */
import m from 'mithril';
import {DataSourceModel} from '../../model/DataSourceModel.js';

export class UploadDialog {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   * @param vnode
   */

  oninit(vnode) {
    this.model = vnode.attrs.model;
    this.onDismiss = vnode.attrs.onDismiss;
    UploadData.new = false;
    UploadData.setName('');
    UploadData.file = '';
    this.selection = null;
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
   * event handler for add-on-right button
   * @param evt
   * @private
   */

  _onAddData(evt) {
    let sources = [];
    if (!this.selection) {
      this.selection = {
        id: UploadData.newName,
        filters: [],
        linkouts: [],
        method: 'GET',
        url: UploadData.file !== '' ? UploadData.file : UploadData.loc,
        config: {},
        parseResult: {data: []}
      };
    }

    const oURL = this.selection.url;
    this.selection.url = UploadData.file !== '' ? UploadData.file : UploadData.loc;
    let cfg = [this.selection];

    let promises = cfg.map(cfg => {
      let dsm = new DataSourceModel(cfg);
      sources.push(dsm);
      return dsm.load();
    });

    Promise.all(promises).then(() => {
      sources.forEach(src => {
        // change names to indicate uploaded data
        if (UploadData.new) {
          this.model.sources.push(src);
        }
        src.parseResult.data.forEach(data => data.feature_type_acc = 'Uploaded_' + data.feature_type_acc);
        // update parseResults and all maps to reflect new data
        this.selection.parseResult.data = this.selection.parseResult.data.concat(src.parseResult.data);
        this.model.allMaps = this.model.sources.map(src => Object.values(src.bioMaps)).concatAll();
        // update active view models to show new data
        this.model.bioMaps.forEach(activeMap => {
          this.model.allMaps.filter(map => {
            return ((map.name === activeMap.name &&
              activeMap.source.id === map.source.id));
          }).forEach(match => {
            activeMap.features = match.features;
            activeMap.tags = match.tags;
          });
        });
      });
      this.selection.url = oURL;
    }).catch(err => {
      const msg = `While loading data source, ${err}`;
      console.error(msg);
      console.trace();
      alert(msg);
    });

    evt.preventDefault();
    this.onDismiss(evt);
  }

  /**
   * event handler for radio button change.
   * @param evt
   * @param map
   * @private
   */

  _onSelection(evt, map) {
    evt.preventDefault();
    this.selection = map;
    UploadData.toggleNew(this.selection);
  }

  view() {
    return m('div.cmap-map-addition-dialog', [
      m('h5', 'Add Map'),
      m('p', 'Currently only one file may be added at a time. If both a URL and a local file are provided, preference will be given to the local file.'),
      m('form', [
        m('table.u-full-width', [
          m('thead', [
            m('tr', [m('th', 'URL'), m('th', m('input[type=text]', {
              oninput: (e) => UploadData.setLoc(e.target.value),
              value: UploadData.loc,
              style: 'width:60%;'
            }))])
            , m('tr', [m('th', 'Local File'), m('th', m('input[type=file]', {
              onchange: (e) => UploadData.setFile(e.target.files),
              file: UploadData.files
            }))])]
          ),
          m('tbody',
            m('tr', [
              m('td', 'Target Map Set'),
              m('td', [
                  m('label', [
                    m('input[type="radio"]', {
                      name: 'maps4new',
                      checked: UploadData.new,
                      value: 'newMap',
                      onchange: (evt) => this._onSelection(evt, null)
                    }), m('input[type=text]', {
                      oninput: (e) => UploadData.setName(e.target.value),
                      value: UploadData.newName
                    })
                  ])
                ].concat(this.model.sources.map(map => {
                  return m('label', [
                    m('input[type="radio"]', {
                      name: `maps4${map.id}`,
                      checked: this.selection === map,
                      value: map.id,
                      onchange: (evt) => this._onSelection(evt, map)
                    }),
                    m('span[class="label-body"]', map.id)
                  ]);
                })
                )
              )
            ])
          )
        ])
      ]),
      m('button', {
          //disabled unless a selection is made, or a new set is selected *and* there is a location or file state)
          disabled: !((this.selection || UploadData.new) && (UploadData.loc !== '' || UploadData.file !== '')),
          class: this.selection || UploadData.new ? 'button-primary' : 'button',
          onclick: evt => this._onAddData(evt)
        }, [
          m('i.material-icons', 'input'),
          'Add Data to Map'
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
 * @type {{loc: string, file: string, newName: string, new: boolean, setLoc: UploadData.setLoc, setName: UploadData.setName, setFile: UploadData.setFile, toggleNew: UploadData.toggleNew}}
 */

let UploadData = {
  loc: '',
  file: '',
  newName: '',
  new: false,
  setLoc: function (value) {
    UploadData.loc = value;
  },
  setName: function (value) {
    UploadData.newName = value;
  },
  setFile: function (files) {
    let reader = new FileReader();
    reader.onload = function (e) {
      UploadData.file = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  },
  toggleNew: function (selection) {
    UploadData.new = !selection;
  }
};

