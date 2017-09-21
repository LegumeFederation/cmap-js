/**
 * FeatureMenu
 * Mithril component for a modal dialog to edit track/subtrack settings
 **/
import m from 'mithril';
//import PubSub from 'pubsub-js';
//import {featureUpdate, reset} from '../../topics';

//import {Menu} from './Menu';
import {ColorPicker} from './ColorPicker';


export class FeatureMenu {
  constructor(data,order){
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
    let model = data.parent.parent.model;
		let tagList = model.tags.sort();
		let settings = {};
		let trackGroups = [];
		let allowRemove = true;

    console.log("ddloop pre model",data);

 	  if(!model.qtlGroups || model.qtlGroups[0] === undefined){
    	order = 0;
    	settings = {filters:[tagList[0]],trackColor:['red']}
     	trackGroups[0]= settings;
    	allowRemove = false;
    } else {
    	trackGroups = model.qtlGroups.slice(0);
      console.log('tg',trackGroups);
    	if(!trackGroups[order]){
    		trackGroups[order] = {filters:[tagList[0]],trackColor:['red']}
    		allowRemove = false;
    	}
    	settings = trackGroups[order];
    }
        
      console.log('setting detective',settings);
		let selected = settings.filters.map( item => {
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
		console.log('modal post', trackConfig);

    //Attach components to viewport, in general these are the close button (x in top
    //right), the acutal modal contents, and the apply/close/delete button bar
    
    m.mount(document.getElementById('cmap-menu-viewport'), {
      view:function(vnode){
        return [
          m(CloseButton),
          m(TrackMenu,{info:trackConfig,count:0})
        ]
      }  
    })

  }
}

/*
 * Div with simple close X
 */
export let  CloseButton = {
  view: function(vnode){
    return m('div',
    { style:'text-align:right;',
      onclick: 
        ()=>{closeModal()}
    },'X');
  }
}

/*
 * Mithril component
 * Div that contains the dropdowns and components for selecting track options
 */
export let TrackMenu = {
  oninit: function (vnode){
    vnode.state = vnode.attrs;
  },
  onupdate: function (vnode){
    console.log('test update');
  },
  view: function(vnode){
		let selected = vnode.state.info.selected;
		let settings = vnode.state.info.settings;
		this.count = 0;
		let dropdows = selected.map( (item,order)=>{
			let dropSettings = {
				selected: selected,
				name: settings.filters[order],
				trackColor: settings.trackColor[order] || settings.trackColor[0],
				tags: vnode.state.info.tagList
			}
			if(selected[order].index === -1){
				selected[order].index = dropSettings.tags.indexOf(dropSettings.name);
			}
      let controls = [
        m('button',{onclick : () =>{
          selected[selected.length] = {index:0};
        }},'+')
      ];
      if(selected.length > 1){
        controls.push(m('button',{onclick: () => { selected.splice(order,1);}},'-'));
      }

			return [m(Dropdown,{settings:dropSettings,order:order,parentDiv:this}),controls];	
		});
    return m('div',{
      onclick: ()=>{console.log(vnode.state.count);vnode.state.count++;},
      style:'overflow:auto;width:100%;height:80%;background:aliceblue;'
    },dropdows);
  }
}

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
    console.log('modal dd attrs',vnode.attrs.parentDiv.count, vnode.state.count);
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
  	]), m(ColorPicker,{settings:vnode.state.settings,order:order}));
	}
}
		
		

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

