/**
 * A mithril component of the UI tools in a div (toolbar).
 */
import m from 'mithril';

import {ResetButton} from './ResetButton';
import {RemoveMapButton} from './RemoveMapButton';
import {AddMapButton} from './AddMapButton';
import {ConfigurationButton} from './ConfigurationButton';
import {UploadButton} from './UploadButton';
//import {FilterButton} from './FilterButton';
import {MapRemovalDialog} from './MapRemovalDialog';
import {MapAdditionDialog} from './MapAdditionDialog';
import {ConfigurationDialog} from './ConfigurationDialog';
import {UploadDialog} from './UploadDialog';

export class Tools {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
    this.currentDialog = vnode.attrs.dialog;
  }

  /**
   * mithril component render method
   */
  view() {
    return m('div.cmap-tools', [
      m('div.cmap-toolbar.cmap-hbox', [
        m(ResetButton),
        //m(FilterButton),
        m(AddMapButton, {
          onclick: () => this.currentDialog = MapAdditionDialog
        }),
        m(RemoveMapButton, {
          onclick: () => this.currentDialog = MapRemovalDialog
        }),
        m(ConfigurationButton, {
          onclick: () => this.currentDialog = ConfigurationDialog
        }),
        m(UploadButton, {
          onclick: () => this.currentDialog = UploadDialog
        })
      ]),
      this.currentDialog && m(this.currentDialog, {
        model: this.appState,
        onDismiss: () => this.currentDialog = null,
      })
    ]);
  }
}
