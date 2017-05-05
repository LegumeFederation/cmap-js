/**
 * A mithril component for map removal dialog
 */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {mapAdded} from '../../topics';

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
  onCancel(evt) {
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
                m('td', source.uniquePrefix),
                m('td', allMaps.filter( map => {
                  return (map.dsn === source.uniquePrefix &&
                          this.model.bioMaps.indexOf(map) === -1);
                }).map( map => {
                    return m('label', [
                      m('input[type="radio"]', {
                        name: `maps4${source.uniquePrefix}`,
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
          onclick: evt => this.onCancel(evt)
        }, [
          m('i.material-icons', 'keyboard_arrow_left'),
          'Add Map On Left'
        ]
      ),
      m('button.button',  {
          disabled: this.selection ? false : true,
          class: this.selection ? 'button-primary' : 'button',
          onclick: evt => this.onCancel(evt)
        }, [
          m('i.material-icons', 'keyboard_arrow_right'),
          'Add Map On Right'
        ]
      ),
      m('button.button', { onclick: evt => this.onCancel(evt) }, [
        m('i.material-icons', 'cancel'),
        'Cancel'
      ])
    ]);
  }
}
