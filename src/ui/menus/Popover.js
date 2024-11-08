/**
 * popover
 * A mithril component for displaying feature information.
 */
import m from 'mithril';

import * as mixwith from '../../../mixwith.js/src/mixwith.mjs';
const { mix } = mixwith;
import {Menu} from './Menu.js';
import {RegisterComponentMixin} from '../RegisterComponentMixin.js';

export class Popover extends mix(Menu).with(RegisterComponentMixin) {

  /**
   *
   * @param vnode
   */

  oninit(vnode) {
    super.oninit(vnode);
  }

  /**
   * mithril component render method
   * @param vnode
   * @returns {*}
   */

  view(vnode) {
    let b = vnode.attrs.domBounds || {};
    let info = vnode.attrs.info || {data: []};
    return m('div', {
      class: 'biomap-info',
      style: `left: ${info.left + b.left}px; top: ${info.top + b.top}px;
               display: ${info.display};`,
    }, this._generateInner(info.data));
  }

  /**
   * Generate the inner content of the popover
   * @param data
   * @returns {*}
   * @private
   */

  _generateInner(data) {
    if (!data) return;

    function closeModal() {
      // Reset cmap-menu-viewport to an empty state
      m.mount(document.getElementById('cmap-menu-viewport'), null);
      // Restore visibility and display
      document.getElementById('cmap-layout-viewport').style.visibility = 'visible';
      document.getElementById('cmap-menu-viewport').style.display = 'none';
    }
  
    // Modal component
    const Modal = {
      oncreate: function () {
        const selector = '#table-container'; // Target div for the table inside the modal
        const service  = {root: 'https://mines.legumeinfo.org/glycinemine/service/'};
        const query    = {
          "from": "QTL",
          "select": [
            "name",
            "linkageGroup.name",
            "start",
            "end",
            "likelihoodRatio",
            "markerNames",
            "lod",
            "markerR2",
            "peak"
          ],
          "orderBy": [
            {
              "path": "name",
              "direction": "ASC"
            }
          ],
          "where": [
            {
              "path": "name",
              "op": "=",
              "value": `${data[0].model.name}`,
              "code": "A"
            }
          ]
        };
  
        // Load the table inside the modal
        imtables.loadTable(
          selector,
          {"start":0,"size":25},
          {service: service, query: query}
        ).then(
          function (table) { console.log('Table loaded', table); },
          function (error) { console.error('Could not load table', error); }
        );
      },
      view: function () {
        return m('div', { class: 'cmap-modal-overlay' }, [
          m('div', { class: 'cmap-modal' }, [
            m('h5', `${data[0].model.name}`), // Title
            m('div#table-container'), // Container where imtables will load the table
            m('div.cmap-modal-controls', [
              m('button', {
                onclick: () => closeModal()
              }, 'Close')
            ])
          ])
        ]);
      }
    };
  
    let popover = data.map(item => {
      let start = m('div', 'start:  ' + item.model.coordinates.start);
      let stop = m('div', 'stop:  ' + item.model.coordinates.stop);
      let tags = item.model.tags.length > 0 && typeof item.model.tags[0] !== 'undefined' ? m('div', 'tags:  ', item.model.tags.join('\n')) : [];
      let aliases = item.model.aliases.length > 0 && typeof item.model.aliases[0] !== 'undefined' ? m('div', 'aliases:  ', item.model.aliases.join('\n')) : [];
      let links = item.model.source.linkouts.length > 0 ?
        m('div', {id: `links-div-${item.model.name}`},
          item.model.source.linkouts.filter(l => (!l.isLinkingService) && item.model.typeLinkedBy(l)).map(
            l => {
              return m('div', {}, m('a', {
                'target': '_blank',
                'href': l.url.replace(/\${item.id}/, item.model.name)
              }, l.text));
            }
          ).concat(
            item.model.source.linkouts.some(l => {
              return l.isLinkingService && item.model.typeHasLinkouts;
            }) ?
              (item.model.links === undefined ? m('img[src=images/ajax-loader.gif]') : item.model.links.map(l => {
                return m('div', {}, m('a', {target: '_blank', href: l.href}, l.text));
              }))
              : []
          )
        ) : [];
  
      // Check if modal is needed
      let qtlButton = item.model.source.linkouts.some(linkout => linkout.modal === true)
        ? m('button', {
            onclick: () => {
              // Mount modal
              document.getElementById('cmap-layout-viewport').style.visibility = 'hidden';
              document.getElementById('cmap-menu-viewport').style.display = 'block';
              m.mount(document.getElementById('cmap-menu-viewport'), Modal);
            }
          }, item.model.source.linkouts.find(linkout => linkout.modal === true).modalText || "Open Modal")
        : null;
  
      return [
        m(this._buttonTest(item.model), {targetId: item.model.name}),
        m('div', {
          class: 'biomap-info-data',
          id: `biomap-info-${item.model.name}`,
          style: 'display: none;'
        }, [start, stop, tags, aliases, links, qtlButton])
      ];
    });
  
    return m('div', {}, popover);
  }

  /**
   *
   * @param feature
   * @returns {{view: view}}
   * @private
   */

  _buttonTest(feature) {
    let Links = {
      fetch: function () {
        let url;
        return feature.source.linkouts.filter(l => l.isLinkingService && feature.tags.includes(l.featuretype)).map(l => {
          url = l.url;
          url = url.replace(/\${item\.id}/, feature.name);
          return m.request({
            method: 'GET',
            url: url,
          })
            .then(function (result) {
              feature.links = result;
            });
        });
      }
    };

    return {
      view: function (vnode) {
        let targetName = `biomap-info-${vnode.attrs.targetId}`;
        return m('div', {
          class: 'biomap-info-name',
          onclick: function () {
            let target = document.getElementById(targetName);
            target.style.display = target.style.display === 'none' ? 'block' : 'none';
            if (feature.links === undefined) {
              if (feature.source.linkouts.some(l => {
                  return l.isLinkingService && feature.typeHasLinkouts;
                })) {
                let p = Links.fetch();
                if (p !== undefined) {
                  p[0].then(vnode.redraw);
                }
              }
              else {
                feature.links = [];
                vnode.redraw();
              }
            }
          }
        }, vnode.attrs.targetId);
      }
    };
  }

  /**
   *
   * @returns {boolean}
   */

  handleGesture() {
    // prevent interacting with div from propagating events
    console.log('popover gesture!');
    return true;
  }
}
