/**
 * ManhattanPlot
 * A SceneGraphNodeTrack representing a Manhattan Plot.
 *
 * @extends SceneGraphNodeTrack
 */
import {Bounds} from '../../model/Bounds';

import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {Dot} from '../geometry/Dot';
import {manhattanRuler} from '../geometry/manhattanRuler';

export class ManhattanPlot extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group of QTL rectangles
   * @param params
   */

  constructor(params) {
    super(params,);
    console.log('manhattan -> constructor', params);
    let manhattanPlot = params.config;
    const b = this.parent.bounds;
    this.trackPos = params.position || 1;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: 0,
      height: b.height
    });
    if (manhattanPlot !== null) {
      let manhattanInfo = manhattanPlot;
      //merge configuration information with default config
      for( let key in this.parent.model.config.manhattan){
        if(!manhattanInfo.hasOwnProperty(key)){
          manhattanInfo[key] = this.parent.model.config.manhattan[key];
        }
      }
      manhattanInfo.lines.forEach(line => {
        if(!line.lineWeight){
          line.lineWeigth = manhattanInfo.featureLineWeight;
        }
        if(!line.lineColor){
          line.lineColor = manhattanInfo.featureLineColor;
        }
      });

      // If data hasn't been attached to this map to plot, filter and attach it.
      if (manhattanInfo.data === undefined) {
        manhattanInfo.view = {
          start: 0,
          stop: manhattanInfo.maxValue || 0
        };

        let baseData = manhattanInfo.appState.sources.filter(model => {
          return model.id === manhattanInfo.dataId;
        });

        let prefix = manhattanInfo.prefix || '';
        manhattanInfo.data = baseData[0].parseResult.data.filter(mdata => {
          if (prefix + mdata[manhattanInfo.targetField] === this.parent.model.name) {
            if (manhattanInfo.max === undefined && -Math.log10(mdata[manhattanInfo.pField]) >= manhattanInfo.view.stop) { //determine max value while filtering data
              manhattanInfo.view.stop = Math.ceil(-Math.log10(mdata[manhattanInfo.pField]));

            }
            return true;
          }
          return false;
        });
      }

      //Draw manhattan plot
      //let left = this.parent.bbGroup.bounds.right;

     this.bounds = new Bounds({
       allowSubpixel: false,
        top: 0,
        left: 0,
        width: manhattanInfo.displayWidth || 0,
        height: b.height
      });

      let fmData = [];
      let locData = [];
      this.fmData = fmData;

      this.manhattanMarks = manhattanInfo.data.map(model => {
        model.coordinates = {
          start: model[manhattanInfo.posField],
          depth: -Math.log10(model[manhattanInfo.pField])
        };
        if((model.coordinates.start > this.parent.model.view.base.stop) ||
          (model.coordinates.start < this.parent.model.view.base.start) ){ return; }

        let fm = new Dot({
          featureModel: model,
          parent: this,
          bioMap: this.parent.model,
          config: manhattanInfo
        });
        fmData.push(fm);

        let loc = {
          minY: model.coordinates.start,
          maxY: model.coordinates.start,
          minX: fm.globalBounds.left,
          maxX: fm.globalBounds.right,
          data: fm
        };

        locData.push(loc);
        return fm;
      });

      this.ruler ={
        minY: 0,
        maxY: 100000000,
        minX: this.globalBounds.left,
        maxX: this.globalBounds.right,
        data: new manhattanRuler({
          featureModel : manhattanInfo,
          parent: this,
          config: manhattanInfo
        })
      };

      this.locMap.load(locData);
      this.tags = ['manhattan'];
    }
  }

  /**
   *
   */

  get visible() {
    return this.locMap.all().concat(this.ruler);
  }

  // /**
  //  * Debug draw to check track positioning
  //  * @param ctx
  //  */

  draw(ctx) {
   // ctx.save();
   // ctx.globalAlpha = .5;
   // ctx.fillStyle = 'green';
   // let cb = this.globalBounds;
   // ctx.fillRect(cb.left,cb.top,cb.width,cb.height);
   // ctx.restore();

    this.children.forEach(child => child.draw(ctx));
  }

  // /**
  //  * Get RTree children that are visible in the canvas' current zoom bounds
//   * @returns {Array}
//   */
//
  get hitMap() {
    //return this.locMap.all();
     let hits = [];
     let childPos = this.mapGroup.map(child => {
         return {
           minY: child.globalBounds.top,
           maxY: child.globalBounds.bottom,
           minX: child.globalBounds.left,
           maxX: child.globalBounds.right,
           data: child
         };
       });

     childPos.forEach(childArray => {
       hits = hits.concat(childArray);
     });
     return hits;
  }
}