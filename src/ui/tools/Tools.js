import m from 'mithril';

import { ResetButton } from './ResetButton';
import { RemoveMapButton } from './RemoveMapButton';
import { AddMapButton } from './AddMapButton';
import { ConfigurationButton } from './ConfigurationButton';
import { UploadButton } from './UploadButton';
import { ExportImageButton } from './ExportImageButton';
import { ExportImageDialog } from './ExportImageDialog';
import { MapRemovalDialog } from './MapRemovalDialog';
import { MapAdditionDialog } from './MapAdditionDialog';
import { ConfigurationDialog } from './ConfigurationDialog';
import { UploadDialog } from './UploadDialog';

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
