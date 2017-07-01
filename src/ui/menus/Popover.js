/**
  * popover
  * A mithril component for displaying feature information.
  */
import m from 'mithril';

import {mix} from '../../../mixwith.js/src/mixwith';
import {Menu} from './Menus';
import {RegisterComponentMixin} from '../RegisterComponentMixin';

export class Popover extends mix(Menu).with(RegisterComponentMixin){

  oninit(vnode){
    super.oninit(vnode);
  }
   
  /**
   * mithril component render method
   */
  view(vnode) {
    let b = vnode.attrs.domBounds || {};
		let info = vnode.attrs.info || {data:[]};
		return m('div', {
       class: 'biomap-info',
       style: `left: ${info.left+b.left}px; top: ${info.top+b.top}px;
               display: ${info.display};`,
     },this._generateInner(info.data));
  }

  _generateInner(data){
    if(!data) return;

    let popover = data.map(item => {
      let start = m('div', 'start:  '+ item.model.coordinates.start);
      let stop = m('div', 'stop:  '+ item.model.coordinates.stop);
      let tags = item.model.tags.length > 0 && typeof item.model.tags[0] != 'undefined' ? m('div','tags:  ',item.model.tags.join('\n')) : [];
      let aliases = item.model.aliases.length > 0 && typeof item.model.aliases[0] != 'undefined'  ?  m('div','aliases:  ',item.model.aliases.join('\n')) : [];
      let links = m('div', {id:`links-div-${item.model.name}`}, [m('img[src=images/ajax-loader.gif]')]);

      return [m(this._buttonTest(item.model),{targetId:item.model.name}),
        m('div',{class:'biomap-info-data', id:`biomap-info-${item.model.name}`, style: 'display: none;'},[start,stop,tags, aliases, links])
      ];
    });
    
    return m('div',{},popover);
  }

  _buttonTest(feature){
    var Links = {
            list: [],
            fetch: function() {
                var url;
                if (feature.tags[0] === 'gene') {
                  url = 'https://legumeinfo.org/gene_links/'+feature.name+'/json';
                }
                if (url !== undefined) {
                    return m.request({
                        method: 'GET',
                        url: url,
                    })
                    .then(function(result) {
                        Links.list = result;
                    });
                }
            }
    };


    return{
      view: function(vnode){
        let targetName = `biomap-info-${vnode.attrs.targetId}`;
        return  m('div', {class:'biomap-info-name', onclick: function() {
          let target = document.getElementById(targetName);
          target.style.display = target.style.display == 'none' ? 'block' : 'none';
          var p = Links.fetch();
          if (p !== undefined) {
            p.then(function () {
              let node = document.getElementById(`links-div-${vnode.attrs.targetId}`);
              while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
              }
              Links.list.map(function(l) {
                  let link =  document.createElement('a');
                  link.setAttribute('href', l.href);
                  link.append(document.createTextNode(l.text));
                  target.append(link);
                  target.append(document.createElement('br'));
              });
              });
          }
          else {
              let node = document.getElementById(`links-div-${vnode.attrs.targetId}`);
              while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
              }
              node.append(document.createTextNode('no links defined'));
          }
          }},
          vnode.attrs.targetId);
      }
    };
  }




	handleGesture(){
		// prevent interacting with div from propegating events
		return true;
	}
}
