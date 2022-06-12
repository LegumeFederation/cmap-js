/**
 * A mithril component for configuration import/export
 */
import m from 'mithril';
import {featureUpdate} from '../../topics';
import PubSub from 'pubsub-js';

export class ConfigurationDialog {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  /**
   *
   * @param vnode
   */

  oninit(vnode) {
    this.model = vnode.attrs.model;
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

    this.onDismiss = vnode.attrs.onDismiss;
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
   * event handler for use  new configuration button
   * @param evt
   * @private
   */

  _onUpdated(evt) {
    let newConfig = JSON.parse(ConfigData.updated);
    let finalConfig = [];
    this.model.allMaps.forEach(map => {
      for (let name in newConfig) {
        if (newConfig.hasOwnProperty(name) && name === map.name && newConfig[name].source === map.source.id) {
          console.log();
          let item = map;
          item.config = newConfig[name].config;
          if(newConfig[name].config.tracks) {
            let tracks = JSON.parse(JSON.stringify(newConfig[name].config.tracks));
            delete newConfig[name].config.tracks;
            item.tracks = tracks;
          }
          finalConfig.push(item);
        }
      }
    });
    this.model.bioMaps = finalConfig;
    for (let i = 0; i < finalConfig.length; i++) {
      PubSub.publish(featureUpdate, {mapIndex: i});
    }
    this.onDismiss(evt);
  }

  /**
   * mithril component render callback.
   * @returns {*}
   */

  view() {
    //const allMaps = this.model.allMaps || [];
    return m('div.cmap-map-addition-dialog', [
      m('h5', 'Configuration Details'),
      m('form', [
        m('textarea', {
            style: 'width:50%;height:600%',
            value: ConfigData.updated,
            onchange: function (e) {
              e.preventDefault();
              ConfigData.updated = String(e.currentTarget.value);
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

/**
 *
 * @type {{base: string, updated: string, setBase: ConfigData.setBase, setUpdated: ConfigData.setUpdated}}
 */

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
