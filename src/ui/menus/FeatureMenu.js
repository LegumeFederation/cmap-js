/**
 * FeatureMenu
 * Mithril component for a modal dialog to edit track/subtrack settings
 **/
import m from 'mithril';
import PubSub from 'pubsub-js';

import {featureUpdate} from '../../topics';
import {ColorPicker} from './ColorPicker';

export class FeatureMenu {
  /**
   *
   * @param data
   * @param order
   */

  constructor(data, order) {
    // Setup modal position based on current placement of the actual map
    // layout viewport. keeps things self-contained when embedding.
    let viewport = document.getElementById('cmap-menu-viewport');
    let layoutBounds = document.getElementById('cmap-layout-viewport').getBoundingClientRect();
    document.getElementById('cmap-layout-viewport').style.visibility = 'hidden';
    viewport.style.display = 'block';
    viewport.style.position = 'absolute';
    viewport.style.top = `${layoutBounds.top}px`;
    viewport.style.left = `${layoutBounds.left}px`;
    viewport.style.width = '95%';
    viewport.style.height = `${layoutBounds.height}px`;
    // Setup track and subtrack data
    let model = data.model || data.component.model;
    let tagList = model.tags.sort();
    let settings = model.tracks[order] ? data.config : model.config.qtl;
    if(typeof settings.fillColor === 'string'){settings.fillColor = [settings.fillColor];}
    let trackGroups = [];
    let filters = settings.filters ? settings.filters.slice() : [tagList[0].slice()];
    let fillColor = settings.fillColor ? settings.fillColor.slice() : ['aqua'];
    if(typeof fillColor === 'string'){fillColor = [fillColor];}


    if(!settings.filters){
      settings.filters = filters;
    }
    if(!settings.fillColor){
      settings.fillColor = fillColor;
    }
    if(!settings.title){
      settings.title = filters[0];
    }

    let defaultSettings = {
      filters : settings.filters.slice(),
      fillColor : settings.fillColor.slice(),
      title : settings.title.slice()
    };

    settings.position = data.position;

    let selected = filters.map((item) => {
      return {
        name: item,
        index: tagList.indexOf(item)
      };
    });

    let trackConfig = {
      model: model,
      tagList: tagList,
      settings: settings,
      selected: selected,
      trackGroups: trackGroups
    };

    //Attach components to viewport, in general these are the close button (x in top
    //right), the actual modal contents, and the apply/close/delete button bar
    let controls = [
      m(_applyButton, {
        model:model,
        config : settings,
        order: order,
        bioMapIndex : model.component.bioMapIndex,
        reset: defaultSettings,
        newData : selected
      }),
      m(_cancelButton, {model: model, config: settings, order: order, reset: defaultSettings})
    ];

    if (order < model.tracks.length) {
      controls.push(m(_removeButton, {
        order:order,
        model:model,
        bioMapIndex : model.component.bioMapIndex,
      }));
    }

    // Build menu mithril component, then mount
    let modalDiv = {
      oncreate: function (vnode) {
        vnode.dom.mithrilComponent = this; // Without this and handleGesture, clicks in modal will pass through to the underlying view
      },
      view: function () {
        return m('div', {style: 'height:100%; width:100%'}, [
            m(CloseButton, {model: model, config: settings, order: order, reset: defaultSettings}),
            m(TitleBox, {settings: settings}),
            m(TrackMenu, {info: trackConfig, count: 0}),
            m('div', {style: 'text-align:center'}, controls)
          ]
        );
      },
      handleGesture: function () {
        return true;
      }
    };
    m.mount(document.getElementById('cmap-menu-viewport'), modalDiv);
  }
}

/**
 *
 * @type {{view: _removeButton.view}}
 * @private
 */

export let _removeButton = {

  /**
   *
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    return m('button', {
      onclick:
        () => {
          vnode.attrs.model.tracks.splice(vnode.attrs.order, 1);
          PubSub.publish(featureUpdate, {mapIndex: vnode.attrs.bioMapIndex});
          m.redraw();
          closeModal();
        },
      style: 'background:red'
    }, 'Remove Track');
  }
};

export let TitleBox = {
  /**
   *
   * @param vnode
   * @returns {*}
   */
  oninit: function (vnode) {
    vnode.state.value = vnode.attrs.settings.title;
  },
  view: function (vnode) {
    return m('div',{},'Track title: ',
      m('input[type=text].title-input', {
        style: 'display:block; width:10%;',
        defaultValue : vnode.attrs.settings.title,
        oninput: m.withAttr('value', function (value) {
          try {
            vnode.attrs.settings.title = value;
          } catch (e) {
            // expect this to fail silently, as most typing will not actually give
            // a proper hex triplet/sextet
          }
        })
      })
    );
  }
};


/**
 *
 * @type {{view: _cancelButton.view}}
 * @private
 */

export let _cancelButton = {

  /**
   *
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    return m('button', {
      onclick:
        () => {
          vnode.attrs.config.fillColor = vnode.attrs.reset.fillColor;
          vnode.attrs.config.filters = vnode.attrs.reset.filters;
          vnode.attrs.config.title = vnode.attrs.reset.title;
          if(vnode.attrs.order < vnode.attrs.model.tracks.length) {
            vnode.attrs.model.tracks[vnode.attrs.order] = vnode.attrs.config;
          }
          closeModal();
        }
    }, 'Cancel');
  }
};

/**
 *
 * @type {{view: _applyButton.view}}
 * @private
 */

export let _applyButton = {

  /**
   *
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    return m('button', {
      onclick: function () {
        vnode.attrs.config.filters = vnode.attrs.newData.map(data => {return data.name;});
        vnode.attrs.model.tracks[vnode.attrs.order] = vnode.attrs.config;
        PubSub.publish(featureUpdate, {mapIndex: vnode.attrs.bioMapIndex});
        m.redraw();
        closeModal();
      }
    }, 'Apply Selection');
  }
};

/**
 * Div with simple close X
 * @type {{view: CloseButton.view}}
 */

export let CloseButton = {

  /**
   *
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    return m('div',
      {
        style: 'text-align:right;',
        onclick:
          () => {
            vnode.attrs.config.fillColor = vnode.attrs.reset.fillColor;
            vnode.attrs.config.filters = vnode.attrs.reset.filters;
            vnode.attrs.config.title = vnode.attrs.reset.title;
            if(vnode.attrs.order < vnode.attrs.model.tracks.length) {
              vnode.attrs.model.tracks[vnode.attrs.order] = vnode.attrs.config;
            }
            closeModal();
          }
      }, 'X');
  }
};

/*
 * Mithril component
 * Div that contains the dropdowns and components for selecting track options
 * @type {{oninit: TrackMenu.oninit, view: TrackMenu.view}}
 */

export let TrackMenu = {

  /**
   *
   * @param vnode
   */

  oninit: function (vnode) {
    vnode.state = vnode.attrs;
    vnode.state.hidden = [];
    vnode.state.picker = [];
  },

  /**
   *
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    let selected = vnode.state.info.selected;
    let settings = vnode.state.info.settings;
    this.count = 0;


    let dropdowns = selected.map((item, order) => {
      if (settings.fillColor[order] === undefined) {
        settings.fillColor[order] = settings.fillColor.slice(0, 1);
      }
      if (!vnode.state.hidden[order]) {
        vnode.state.hidden[order] = 'none';
      }
      if (!vnode.state.picker[order]) {
        vnode.state.picker[order] = settings.fillColor[order] || 'orange';
      }

      let dropSettings = {
        selected: selected,
        name: settings.filters[order],
        fillColor: settings.fillColor,
        tags: vnode.state.info.tagList,
        nodeColor: vnode.state.picker
      };
      if (selected[order].index === -1) {
        selected[order].index = dropSettings.tags.indexOf(dropSettings.name);
      }
      let controls = [
        m('button', {
          onclick: () => {
            selected[selected.length] = {name: vnode.state.info.tagList[0], index: 0};
          }
        }, '+')
      ];
      if (selected.length > 1) {
        controls.push(m('button', {
          onclick: () => {
            selected.splice(order, 1);
          }
        }, '-'));
      }
      controls.push(m('button', {
          onclick: () => {
            vnode.state.hidden[order] = vnode.state.hidden[order] === 'none' ? 'block' : 'none';
          }
        }, m('div',
        {style: `color:${vnode.state.picker[order]}`}
        , '■')
      ));
      return [m(Dropdown, {
        settings: dropSettings,
        order: order,
        parentDiv: this,
        hidden: vnode.state.hidden
      }), controls];
    });
    return m('div#track-select-div', {
      style: 'overflow:auto;width:100%;height:80%;'
    }, dropdowns);
  }
};

/*
 * Mithril component
 * Actual dropdown selector
 * @type {{oninit: Dropdown.oninit, onbeforeupdate: Dropdown.onbeforeupdate, view: Dropdown.view}}
 */

export let Dropdown = {

  /**
   *
   * @param vnode
   */

  oninit: function (vnode) {
    vnode.state = vnode.attrs;
  },
  /**
   *
   * @param vnode
   */

  onbeforeupdate: function (vnode) {
    if (vnode.state.count > vnode.attrs.parentDiv.count) {
      vnode.attrs.parentDiv.count = vnode.state.count;
    } else {
      vnode.state.count = vnode.attrs.parentDiv.count;
    }
  },

  /**
   *
   * @param vnode
   * @returns {*}
   */

  view: function (vnode) {
    let order = vnode.state.order;
    let settings = vnode.state.settings;
    return m('div', m('select', {
      id: `selector-${order}`,
      selectedIndex: settings.selected[order].index,
      oninput: (e) => {
        let selected = e.target.selectedIndex;
        settings.selected[order].name = settings.tags[selected];
        settings.selected[order].index = selected;
      }
    }, [settings.tags.map(tag => {
      return m('option', tag);
    })
    ]), m(ColorPicker, {settings: vnode.state.settings, order: order, hidden: vnode.state.hidden}));
  }
};


/**
 * Function to close the menu-viewport and reshow the
 * layout viewport
 *
 */

export function closeModal() {
  //reset cmap-menu-viewport vdom tree to empty state
  m.mount(document.getElementById('cmap-menu-viewport'), null);
  //explicitly set visibility to avoid weird page interaction issues
  document.getElementById('cmap-layout-viewport').style.visibility = 'visible';
  document.getElementById('cmap-menu-viewport').style.display = 'none';
}

