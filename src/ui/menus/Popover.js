/**
 * Popover 
 * Mithril component for displaying a popover menu with information
 */
import m from 'mithril';
import * as mixwith from '../../../mixwith.js/src/mixwith.mjs';
const { mix } = mixwith;
import { Menu } from './Menu.js';
import { RegisterComponentMixin } from '../RegisterComponentMixin.js';
import { InterMineModal } from './InterMineModal.js';

export class Popover extends mix(Menu).with(RegisterComponentMixin) {
  oninit(vnode) {
    super.oninit(vnode);
    this.modalContainerId = 'cmap-modal-container';
    this.modalMounted = false; // Track whether the modal is mounted
  }

  view(vnode) {
    let b = vnode.attrs.domBounds || {};
    let info = vnode.attrs.info || { data: [] };

    return m('div', {
      class: 'biomap-info',
      style: `left: ${info.left + b.left}px; top: ${info.top + b.top}px;
              display: ${info.display};`,
    }, this._generateInner(info.data));
  }

  _generateInner(data) {
    if (!data) return;

    return data.map(item => {
      const { model } = item;
      const { coordinates, tags, aliases, source } = model;

      const openModal = () => {
        const layoutViewport = document.getElementById('cmap-layout-viewport');

        if (layoutViewport && !this.modalMounted) {
          this.modalMounted = true;

          // Create container for the modal if it doesn't exist
          let modalContainer = document.getElementById(this.modalContainerId);
          if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = this.modalContainerId;
            layoutViewport.appendChild(modalContainer);
          }

          // Mount modal to container
          m.mount(modalContainer, {
            view: () =>
              m(InterMineModal, {
                data: data,
                url: source.linkouts.find(l => l.modal)?.mineUrl,
                closeModal: this._closeModal.bind(this),
              }),
          });
        }
      };

      const modalTrigger = source.linkouts.some(linkout => linkout.modal)
        ? m('button', { class: 'modal-button', onclick: openModal }, source.linkouts.find(l => l.modal)?.modalText || 'Open Modal')
        : null;

      return m('div', [
        m('div', `start: ${coordinates.start}`),
        m('div', `stop: ${coordinates.stop}`),
        tags.length ? m('div', `tags: ${tags.join(', ')}`) : null,
        aliases.length ? m('div', `aliases: ${aliases.join(', ')}`) : null,
        modalTrigger,
      ]);
    });
  }

  _closeModal() {
    const modalContainer = document.getElementById(this.modalContainerId);
    if (modalContainer && this.modalMounted) {
      m.mount(modalContainer, null); // Unmount modal
      modalContainer.remove(); // Remove modal container from the DOM
      this.modalMounted = false; // Reset modal mount status
    }
  }
}
