/**
 * A mithril component for map removal dialog
 */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {mapRemoved} from '../../topics';

export class MapRemovalDialog {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   * @param vnode
   */

  oninit(vnode) {
    this.model = vnode.attrs.model;
    this.onDismiss = vnode.attrs.onDismiss;
    this.selection = [];
  }

  /**
   * event handler for cancel button
   * @param evt
   * @private
   */

  _onCancel(evt) {
    evt.preventDefault();
    this.onDismiss(evt);
  }

  /**
   * event handler for remove button
   * @param evt
   * @private
   */

  _onRemove(evt) {
    const filtered = this.model.bioMaps.filter(bioMap => {
      return this.selection.indexOf(bioMap) === -1;
    });
    this.model.bioMaps = filtered;
    PubSub.publish(mapRemoved, this.selection);
    evt.preventDefault();
    this.onDismiss(evt);
  }

  /**
   * event handler for checkbox
   * @param bioMap
   * @private
   */

  _onToggleSelection(bioMap) {
    const i = this.selection.indexOf(bioMap);
    if (i === -1) {
      this.selection.push(bioMap);
    }
    else {
      this.selection.splice(i, 1);
    }
  }

  /**
   * mithril render callback
   * @returns {*}
   */

  view() {
    const haveSelection = this.selection.length > 0;
    const plural = this.selection.length > 1;
    return m('div.cmap-map-removal-dialog', [
      m('h5', plural ? 'Remove Maps' : 'Remove Map'),
      m('form', [
        this.model.bioMaps.map(bioMap => {
          return m('label.cmap-map-name', [
            m('input[type="checkbox"]', {
              checked: this.selection.indexOf(bioMap) !== -1,
              onclick: () => this._onToggleSelection(bioMap)
            }),
            m('span.label-body', bioMap.uniqueName)
          ]);
        }),
        m('button', {
          class: haveSelection ? 'button-primary' : 'button',
          disabled: !haveSelection,
          autocomplete: 'off', // firefox workaround for disabled state
          onclick: evt => this._onRemove(evt)
        }, [
          m('i.material-icons', 'remove_circle_outline'),
          'Remove Selected'
        ]),
        m('button.button', {onclick: evt => this._onCancel(evt)}, [
          m('i.material-icons', 'cancel'),
          'Cancel'
        ])
      ])
    ]);
  }
}
