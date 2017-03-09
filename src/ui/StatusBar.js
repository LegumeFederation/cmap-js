import m from 'mithril';
import ToolState from '../state/ToolState';

export class StatusBar {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  describeTool() {
    switch(this.toolState.activeTool)
    {
      case 'move':
        return 'move (drag anywhere to pan the visualization)';
      case 'zoom':
        return `zoom (drag up/down to zoom in or out on the visualization.
                select an individual map or the entire frame)`;
      default:
        return '';
    }
  }

  view() {
    return m('div',
      { class: 'toolstate' },
      [
        this.toolState.activeTool ?
          'current tool: ' + this.describeTool()
          :
          []
      ]
    );
  }
}
