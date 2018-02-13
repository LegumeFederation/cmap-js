/**
 * A mithril component for configuration import/export
 */
import m from 'mithril';

export class ConfigurationDialog {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.model = vnode.attrs.model;
    console.log('cd', this.model);
    let cd = {};
    this.model.bioMaps.forEach(bioMap => {
      cd[bioMap.name] = {
        config: bioMap.config,
        name: bioMap.name,
        qtlGroups: bioMap.qtlGroups,
        source: bioMap.source.id
      };
    });

    ConfigData.base = JSON.stringify(cd, null, 2);
    ConfigData.updated = JSON.stringify(cd, null, 2);
    console.log('cdp', cd);

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
  _onUpdated(evt) {
    let newConfig = JSON.parse(ConfigData.updated);
    let finalConfig = [];
    this.model.allMaps.forEach(map => {
      for (var name in newConfig) {
        if (newConfig.hasOwnProperty(name) && name === map.name && newConfig[name].source === map.source.id) {
          let item = map;
          item.config = newConfig[name].config;
          item.qtlGroups = newConfig[name].qtlGroups;
          console.log('cd conf', newConfig[name]);
          finalConfig.push(item);
        }
      }
    });
    console.log('cd fin', finalConfig);
    this.model.bioMaps = finalConfig;
    this.onDismiss(evt);
  }

  /**
   * mithril component render callback.
   */
  view() {
    const allMaps = this.model.allMaps || [];
    return m('div.cmap-map-addition-dialog', [
      m('h5', 'Configuration Details'),
      m('form', [
        m('textarea', {
            style: 'width:50%;height:600%',
            value: ConfigData.updated,
            onchange: function (e) {
              e.preventDefault();
              ConfigData.updated = e.currentTarget.value;
            }
          }
        )
      ]),
      m('button', {
          class: 'button',
          onclick: evt => this._onUpdated(evt)
        }, [
          m('i.material-icons', 'mode_edit'),
          'Use new configuration'
        ]
      ),
      m('button.button', {onclick: evt => this._onCancel(evt)}, [
        m('i.material-icons', 'cancel'),
        'Cancel'
      ])
    ]);
  }
}

let ConfigData = {
  base: '',
  updated: '',
  setBase: function (value) {
    ConfigData.base = value;
  },
  setUpdated: function (value) {
    ConfigData.updated = value;
  }
};
