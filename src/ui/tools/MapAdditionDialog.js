/**
 * A mithril component for map removal dialog
 */
import m from 'mithril';

export class MapAdditionDialog {

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
  _onAddRight(evt) {
    const i = this.model.bioMaps.length;
    this.model.addMap(this.selection, i);
    evt.preventDefault();
    this.onDismiss(evt);
  }

  /**
   * event handler for add-on-left button
   */
  _onAddLeft(evt) {
    this.model.addMap(this.selection, 0);
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
            m('tr', [ m('th', 'Data Source'), m('th', 'Available Maps') ])
          ),
          m('tbody',
            this.model.sources.map( source => {
              return m('tr', [
                m('td', source.id),
                m('td', allMaps.filter( map => {
                  return (map.source === source &&
                          this.model.bioMaps.indexOf(map) === -1);
                }).map( map => {
                    return m('label', [
                      m('input[type="radio"]', {
                        name: `maps4${source.id}`,
                        checked: this.selection === map,
                        value: map.uniqueName,
                        onchange: (evt) => this._onSelection(evt, map)
                      }),
                      m('span[class="label-body"]', map.name)
                    ]);
                  })
                )
              ]);
            })
          )
        ])
      ]),
      m('button', {
          disabled: this.selection ? false : true,
          class: this.selection ? 'button-primary' : 'button',
          onclick: evt => this._onAddLeft(evt)
        }, [
          m('i.material-icons', 'keyboard_arrow_left'),
          'Add Map On Left'
        ]
      ),
      m('button.button',  {
          disabled: this.selection ? false : true,
          class: this.selection ? 'button-primary' : 'button',
          onclick: evt => this._onAddRight(evt)
        }, [
          m('i.material-icons', 'keyboard_arrow_right'),
          'Add Map On Right'
        ]
      ),
      m('button.button', { onclick: evt => this._onCancel(evt) }, [
        m('i.material-icons', 'cancel'),
        'Cancel'
      ])
    ]);
  }
}
