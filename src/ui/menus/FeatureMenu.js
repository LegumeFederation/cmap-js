/**
 * FeatureMenu
 * Mithril component for a modal dialog to edit track/subtrack settings
 **/
import m from 'mithril';
import PubSub from 'pubsub-js';

import {featureUpdate} from '../../topics';
import {ColorPicker} from './ColorPicker';


export class FeatureMenu {
  constructor(data,order){
    // Setup modal position based on current placement of the actual map
    // layout viewport. keeps things self-contained when embedding.
    console.log("fm",data);
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
    let model = data.parent.parent.model;
		let tagList = model.tags.sort();
		let settings = {};
		let trackGroups = [];
    let defaultSettings = model.qtlGroups && model.qtlGroups[order] != undefined ? {filters:model.qtlGroups[order].filters.slice(0),trackColor:model.qtlGroups[order].trackColor.slice(0)} : undefined;
		if(order == undefined){
			order = model.qtlGroups ? model.qtlGroups.length : 0;
		}

    if(!model.qtlGroups || model.qtlGroups[0] === undefined){
      order = 0;
      settings = {filters:[tagList[0]],trackColor:['red']};
      trackGroups[0]= settings;
      model.qtlGroups = [];
    } else {
      trackGroups = model.qtlGroups.slice(0);
      if(!trackGroups[order]){
        trackGroups[order] = {filters:[tagList[0]],trackColor:['red']};
      }
      settings = trackGroups[order];
    }
        
		let selected = settings.filters.map( (item) => {
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
			trackGroups:trackGroups
		};

    //Attach components to viewport, in general these are the close button (x in top
    //right), the acutal modal contents, and the apply/close/delete button bar
    let controls = [
      m(_applyButton,{position:data.lp,qtl:model.qtlGroups,track:trackGroups,order:order,reset:defaultSettings,newData:selected,mapIndex:model.component.bioMapIndex}),
      m(_cancelButton,{qtl:model.qtlGroups,order:order,reset:defaultSettings,newData:selected})
		];
    
    if(model.qtlGroups[order] != undefined){
      controls.push(m(_removeButton,{qtl:model.qtlGroups,order:order,reset:defaultSettings,newData:selected}));
    }
    
    // Buld menu mithril component, then mount    
    let modalDiv = {
      oncreate: function (vnode){
        vnode.dom.mithrilComponent = this; // Without this and handleGesture, clicks in modal will pass through to the underlying view
      },
      view: function(vnode){
        return m('div',{style:'height:100%; width:100%'},[
          m(CloseButton,{qtl:model.qtlGroups,order:order,reset:defaultSettings,newData:selected}),
          m(TrackMenu,{info:trackConfig,count:0}),
    			m('div',{style:'text-align:center'},controls)
            ]
         )
      },
      handleGesture: function(){
        return true;
      }
    }
    m.mount(document.getElementById('cmap-menu-viewport'), modalDiv);
  }
}

export let _removeButton = {
	view: function(vnode){
		return  m('button',{
			onclick: 
        ()=>{
          vnode.attrs.qtl.splice(vnode.attrs.order,1);
					m.redraw();
          closeModal();
        },
      style:'background:red'
      },'Remove Track');
  }
};

export let _cancelButton = {
	view: function(vnode){
		return  m('button',{
			onclick: 
        ()=>{
          if(vnode.attrs.qtl && vnode.attrs.qtl[vnode.attrs.order] != undefined){
            vnode.attrs.qtl[vnode.attrs.order] = vnode.attrs.reset;
          }
          closeModal();
        }
      },'Close');
  }
};

export let _applyButton = {
	view: function(vnode){
     return  m('button',{
        onclick: function(){
					let order = vnode.attrs.order;
          let filters = vnode.attrs.newData.map( selected => {
            return selected.name;
         });
					let colors = vnode.attrs.track[order].trackColor;
          console.log("applyInfo",vnode.attrs)
					vnode.attrs.qtl[order] = {filters: filters.slice(0), trackColor:colors.slice(0),position:vnode.attrs.position};
          //Let UI layout know which map to update
					PubSub.publish(featureUpdate,{mapIndex:vnode.attrs.mapIndex});
					m.redraw();
					closeModal();
        }
      },'Apply Selection');
  }
};

/*
 * Div with simple close X
 */
export let  CloseButton = {
  view: function(vnode){
    return m('div',
    { style:'text-align:right;',
      onclick: 
        ()=>{
          if(vnode.attrs.qtl && vnode.attrs.qtl[vnode.attrs.order] != undefined){
            vnode.attrs.qtl[vnode.attrs.order] = vnode.attrs.reset;
          }
          closeModal();
        }
    },'X');
  }
};

/*
 * Mithril component
 * Div that contains the dropdowns and components for selecting track options
 */
export let TrackMenu = {
  oninit: function (vnode){
    vnode.state = vnode.attrs;
		vnode.state.hidden = [];
		vnode.state.picker = [];
  },
  view: function(vnode){
		let selected = vnode.state.info.selected;
		let settings = vnode.state.info.settings;
		this.count = 0;

		let dropdows = selected.map( (item,order)=>{
      if(settings.trackColor[order] == undefined){
        settings.trackColor[order] = settings.trackColor.slice(0,1);
      }
			if(!vnode.state.hidden[order]){
				vnode.state.hidden[order] = 'none';
			}
			if(!vnode.state.picker[order]){
				vnode.state.picker[order] = settings.trackColor[order] || 'orange';
			}
			let dropSettings = {
				selected: selected,
				name: settings.filters[order],
				trackColor: settings.trackColor,
				tags: vnode.state.info.tagList,
				nodeColor: vnode.state.picker
			};
			if(selected[order].index === -1){
				selected[order].index = dropSettings.tags.indexOf(dropSettings.name);
			}
      let controls = [
        m('button',{onclick : () =>{
          selected[selected.length] = {name:vnode.state.info.tagList[0],index:0};
        }},'+')
      ];
      if(selected.length > 1){
        controls.push(m('button',{onclick: () => { selected.splice(order,1);}},'-'));
      }
      controls.push(m('button',{
					onclick: () => {
						vnode.state.hidden[order] = vnode.state.hidden[order]==='none'? 'block':'none';
					}
				},m('div',
					{style:`color:${vnode.state.picker[order]}`}
				,'■')
			));
			return [m(Dropdown,{settings:dropSettings,order:order,parentDiv:this,hidden:vnode.state.hidden}),controls];	
		});
    return m('div#track-select-div',{
      style:'overflow:auto;width:100%;height:80%;'
    },dropdows);
  }
};

/*
 * Mithril component
 * Actual dropdown selector
 */
export let Dropdown = {
  oninit: function(vnode){
    vnode.state = vnode.attrs;
  },
  onbeforeupdate: function(vnode){
    if(vnode.state.count > vnode.attrs.parentDiv.count){
      vnode.attrs.parentDiv.count = vnode.state.count;
    } else {
      vnode.state.count = vnode.attrs.parentDiv.count;
    }
  },
	view: function(vnode){
    let order = vnode.state.order;
		let settings = vnode.state.settings;
    return m('div',m('select',{
      id:`selector-${order}`,
      selectedIndex : settings.selected[order].index,
      oninput: (e)=>{
        var selected = e.target.selectedIndex;
        settings.selected[order].name = settings.tags[selected];
        settings.selected[order].index = selected;
       }
    },[settings.tags.map(tag => {
      return m('option', tag);
      })
    ]), m(ColorPicker,{settings:vnode.state.settings,order:order,hidden:vnode.state.hidden}));
	}
};

/*
 * Function to close the menu-viewport and reshow the
 * layout viewport
 */
export function closeModal (){
  //reset cmap-menu-viewport vdom tree to empty state
  m.mount(document.getElementById('cmap-menu-viewport'),null);
  //explicity set visibility to avoid weird page interaction issues
  document.getElementById('cmap-layout-viewport').style.visibility = 'visible';
  document.getElementById('cmap-menu-viewport').style.display = 'none';
}

