/**
 * A mithril component for displaying help information
 */
import m from 'mithril';
export class HelpDialog {

    // constructor() - prefer do not use in mithril components
    oninit(vnode) {
        this.onDismiss = vnode.attrs.onDismiss;
    }


    _onClose(evt) {
        evt.preventDefault();
        this.onDismiss(evt);
      }

    view() {
        return m('div.cmap-map-addition-dialog', [
            m('.help-content', [
                m('h5', 'Help'),
                m('p', 'This is a help dialog.'),
                m('p', 'Instructions on how to use cmap-js go here.'),                
            ]),
            m('button.button', {onclick: evt => this._onClose(evt)}, [
                m('i.material-icons', 'cancel'),
                'Close'
            ])
        ]);
    }
}
