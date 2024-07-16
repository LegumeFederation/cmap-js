/**
 *
 * Base Component, placeholder for other canvas components
 *
 */

import m from 'mithril';

export class BioMapComponent {
  oninit(vnode) {
    this.attrs = vnode.attrs;
    // Ensure initial bounds are set up, potentially with default values
    this.domBounds = this.attrs.bioMap.domBounds || { left: 0, top: 0, width: 300, height: 150, rotation: 0 };
  }

  oncreate(vnode) {
    this.canvas = vnode.dom;
    this.attrs.bioMap.canvas = this.canvas;
    this.context2d = this.attrs.bioMap.context2d = this.canvas.getContext('2d');
    this.context2d.imageSmoothingEnabled = false;

    vnode.dom.mithrilComponent = this;

    if (this.attrs.bioMap && typeof this.attrs.bioMap.draw === 'function') { // draw is a function
      this.attrs.bioMap.draw();
      this.attrs.bioMap.dirty = false;
    }
  }

  onupdate(vnode) { // Update the canvas when the component is updated
    if (this.attrs.bioMap.dirty) { // Check if the bioMap is dirty
      this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
      this.attrs.bioMap.draw(); // Redraw the bioMap
      this.attrs.bioMap.dirty = false; // Reset the dirty flag
    }
  }

  view(vnode) {
    this.updateAttributes(vnode);

    const { left, top, width, height, rotation } = this.domBounds;
    const selectedClass = this.attrs.selected ? 'selected' : '';

    return m('canvas.cmap-canvas.cmap-biomap', { // Render the canvas element
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`
      },
      width: width,
      height: height
    });
  }

  updateAttributes(vnode) {
    if (this.attrs.bioMap && this.attrs.bioMap.model !== vnode.attrs.bioMap.model) {
      this.attrs.bioMap = vnode.attrs.bioMap;
      this.domBounds = this.attrs.bioMap.domBounds;
      this.context2d = this.attrs.bioMap.context2d = this.canvas.getContext('2d');
      this.context2d.imageSmoothingEnabled = false;
    }
  }

  handleGesture(evt) {
    if (this.attrs.bioMap.handleGesture(evt)) {
      this.attrs.bioMap.dirty = true;
      return true;
    }
    return false;
  }
}
