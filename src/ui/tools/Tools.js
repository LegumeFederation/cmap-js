import m from 'mithril';

import { ResetButton } from './ResetButton.js';
import { RemoveMapButton } from './RemoveMapButton.js';
import { AddMapButton } from './AddMapButton.js';
import { ConfigurationButton } from './ConfigurationButton.js';
import { UploadButton } from './UploadButton.js';
import { ExportImageButton } from './ExportImageButton.js';
import { ExportImageDialog } from './ExportImageDialog.js';
import { MapRemovalDialog } from './MapRemovalDialog.js';
import { MapAdditionDialog } from './MapAdditionDialog.js';
import { ConfigurationDialog } from './ConfigurationDialog.js';
import { UploadDialog } from './UploadDialog.js';

export class Tools {
  constructor(vnode) {
    this.appState = vnode.attrs.appState;
    this.currentDialog = null;
  }

  handleAddMapClick() {
    this.currentDialog = MapAdditionDialog;
  }

  handleRemoveMapClick() {
    this.currentDialog = MapRemovalDialog;
  }

  handleConfigurationClick() {
    this.currentDialog = ConfigurationDialog;
  }

  handleUploadClick() {
    this.currentDialog = UploadDialog;
  }

  handleExportImageClick() {
    this.currentDialog = ExportImageDialog;
  }

  handleDialogDismiss() {
    this.currentDialog = null;
  }

  view() {
    return m('div.cmap-tools', [
      m('div.cmap-toolbar.cmap-hbox', [
        m(ResetButton),
        m(AddMapButton, {
          onclick: () => this.handleAddMapClick()
        }),
        m(RemoveMapButton, {
          onclick: () => this.handleRemoveMapClick()
        }),
        m(ConfigurationButton, {
          onclick: () => this.handleConfigurationClick()
        }),
        m(UploadButton, {
          onclick: () => this.handleUploadClick()
        }),
        m(ExportImageButton, {
          onclick: () => this.handleExportImageClick()
        })
      ]),
      this.currentDialog && m(this.currentDialog, {
        model: this.appState,
        onDismiss: () => this.handleDialogDismiss()
      })
    ]);
  }
}
