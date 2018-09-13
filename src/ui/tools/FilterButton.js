/**
 * A mithril component of Filter button
 */
import m from 'mithril';

export class FilterButton {

  // constructor() - prefer do not use in mithril dataSourceComponents

  /**
   * mithril render callback
   * @returns {*}
   */

  view() {
    const attrs = {
      onclick: evt => this._onClick(evt)
    };
    return m('button', attrs, [
      m('i.material-icons', 'filter_list'),
      'Filter'
    ]);
  }

  /**
   * button event handler
   */
  _onClick() {
  }
}
