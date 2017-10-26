/**
 * A mithril component for map removal dialog
 */
import m from 'mithril';
import {DataSourceModel} from '../../model/DataSourceModel';
export class UploadDialog {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.model = vnode.attrs.model;
    this.onDismiss = vnode.attrs.onDismiss;
    this.selection = null;
  }

  /**
   * event handler for cancel button.
   */
  _onCancel(evt) {
    evt.preventDefault();
    this.onDismiss(evt);
  }

  /**
   * event handler for add-on-right button
   */
  _onAddData(evt) {
    let sources = [];
    let uploadedMaps = [];

    this.selection.url = UploadData.loc;
    let cfg = [this.selection];
    
    let promises = cfg.map( cfg => {
      let dsm = new DataSourceModel(cfg);
      sources.push(dsm);
      return dsm.load();
    });
    
    Promise.all(promises).then( () => {
      uploadedMaps = sources.map( src => Object.values(src.bioMaps)).concatAll();
      let activeMaps = this.model.bioMaps.filter(map => {return(map.source.id === this.selection.id)});
      sources.map( src => Object.values(this.selection.bioMaps)).concatAll().forEach( map => {
        uploadedMaps.forEach( upMap => {
          if(upMap.name === map.name){
            upMap.features.forEach( feature => feature.tags = ["Uploaded"])
            map.features = map.features.concat(upMap.features);
            map.tags.push("Uploaded");
          }
        });
        activeMaps.forEach( actMap => {
          if(actMap.name === map.name){
            actMap.features = map.features;
            actMap.tags = map.tags;
          }
        });
      });
    }). catch( err => {
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
   */
  _onSelection(evt, map) {
    evt.preventDefault();
    this.selection = map;
  }

  /**
  * mithril component render callback.
  */
  view() {
    const allMaps = this.model.allMaps || [];
    return m('div.cmap-map-addition-dialog', [
      m('h5', 'Add Map'),
      m('form', [
        m('table.u-full-width', [
          m('thead',
            m('tr', [ m('th', 'Data Source'), m('th',m("input[type=text]", {oninput: m.withAttr("value", UploadData.setLoc), value: UploadData.loc, style:'width:60%;'})) ])
          ),
          m('tbody',
              m('tr', [
                m('td', "Available Maps"),
                m('td', this.model.sources.map( map => {
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
              ])
          )
        ])
      ]),
      m('button', {
          disabled: this.selection ? false : true,
          class: this.selection ? 'button-primary' : 'button',
          onclick: evt => this._onAddData(evt)
        }, [
          m('i.material-icons', 'input'),
          'Add Data to Map'
        ]
      ),
      m('button.button', { onclick: evt => this._onCancel(evt) }, [
        m('i.material-icons', 'cancel'),
        'Cancel'
      ])
    ]);
  }
}

let UploadData = {
  loc: "",
  setLoc: function(value){
    UploadData.loc = value;
  }
}

