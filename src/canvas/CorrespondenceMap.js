/**
  * CorrespondenceMap
  * Mithril component for correspondence lines between 2 or more BioMaps with an
  * html5 canvas element.
  */

import {Bounds} from '../model/Bounds';
import {SceneGraphNodeCanvas} from './SceneGraphNodeCanvas';
import {Group} from './SceneGraphNodeGroup';
import {CorrespondenceMark} from './CorrespondenceMark';
import {featuresInCommon} from '../model/Feature';

export class CorrespondenceMap extends SceneGraphNodeCanvas{
  constructor({bioMapComponents, appState, layoutBounds}) {
    super({});
    this.bioMapComponents = bioMapComponents;
    this.appState = appState;
    this.verticalScale = 1;
    this.correspondenceMarks = [];
    this._layout(layoutBounds);
  }

  /**
   * draw our scenegraph children our canvas element
   */
  draw() {
    let ctx = this.context2d;
    if(! ctx) return;
    if(! this.domBounds) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let gb = this.globalBounds || {};
    ctx.save();
    ctx.fillStyle = 'cyan';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
    ctx.restore();
    this.visible.map(child => child.data.draw(ctx));
    // store these bounds, for checking in drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
  }

  /**
   * getter for common features between our bioMaps.
   */
  get commonFeatures() {
    // TODO: support more than 2 sets of features (e.g. for circos layout)
    //let leftFeatures = this.bioMapComponents[0].model.features;
    //let rightFeatures = this.bioMapComponents[1].model.features;
    let leftFeatures = this.bioMapComponents[0].backbone.filteredFeatures;
    let rightFeatures = this.bioMapComponents[1].backbone.filteredFeatures;
    let common = featuresInCommon(leftFeatures, rightFeatures);
    return common;
  }

  _layout(layoutBounds) {
    this.domBounds = layoutBounds;
    // this.bounds (scenegraph) has the same width and height, but zero the
    // left/top because we are the root node in a canvas sceneGraphNode
    // heirarchy.
    let gb1 = this.bioMapComponents[0].backbone.backbone.globalBounds;
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
    
    let corrData = [];
    let coorGroup = new Group({parent:this});
    coorGroup.bounds = new Bounds({
      top: gb1.top,
      left: this.bioMapComponents[0].backbone.backbone.bounds.width/4,
      width: this.domBounds.width - gb1.width,
      height: gb1.height,
    });
    this.addChild(coorGroup);
    console.log('childBounds', this.globalBounds, coorGroup.globalBounds);

    let bioMapCoordinates = [
      this.bioMapComponents[0].mapCoordinates, 
      this.bioMapComponents[1].mapCoordinates
    ];
    this.commonFeatures.forEach( feature => {
      let corrMark = new CorrespondenceMark({
        parent: coorGroup,
        featurePair: feature,
        mapCoordinates:bioMapCoordinates,
        bioMap : this.bioMapComponents
      });
      coorGroup.addChild(corrMark);
      corrData.push({
        minX:this.bounds.left,
        maxX:this.bounds.right ,
        minY:feature[0].coordinates.start ,
        maxY: feature[1].coordinates.start,
        data: corrMark
      });
    });
    this.locMap.load(corrData); 
    console.log('bioMap', this.locMap.all());
  }

  get visible(){
    return this.locMap.all();
  }
}
