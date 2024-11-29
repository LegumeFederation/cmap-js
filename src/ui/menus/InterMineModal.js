/**
 * InterMineModal
 * Modal component for retrieving QTL data from an InterMine instance and displaying it in a table.
 */
import m from 'mithril';

export const InterMineModal = {
  oncreate(vnode) {
    const { url, data } = vnode.attrs;
    const selector = '#table-container'; // Target div for the table inside the modal
    const service = { root: url };
    const query = {
      from: 'QTL',
      select: [
        'name',
        'linkageGroup.name',
        'start',
        'end',
        'likelihoodRatio',
        'markerNames',
        'lod',
        'markerR2',
        'peak',
      ],
      orderBy: [{ path: 'name', direction: 'ASC' }],
      where: [{ path: 'name', op: '=', value: `${data[0].model.name}`, code: 'A' }],
    };

    imtables // eslint-disable-line no-undef
      .loadTable(selector, { start: 0, size: 25 }, { service, query })
      .then(
        () => console.log('Table loaded successfully'),
        (error) => console.error('Error loading table:', error)
      );
  },
  view(vnode) {
    const { data, closeModal } = vnode.attrs;

    return m('div', { class: 'cmap-modal-overlay' }, [
      m('div', { class: 'cmap-modal cmap-intermine-modal' }, [
        m('h5', `${data[0].model.name}`), // Title
        m('div#table-container'),
        m('div.cmap-modal-controls', [
          m('button', { onclick: closeModal }, 'Close'), // Close button
        ]),
      ]),
    ]);
  },
};
