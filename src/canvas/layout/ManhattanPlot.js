/**
 * ManhattanPlot
 * A SceneGraphNodeTrack representing a Manhattan Plot.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {SceneGraphNodeGroup} from '../node/SceneGraphNodeGroup';
import {Bounds} from '../../model/Bounds';

import {Dot} from '../geometry/Dot';

export class ManhattanPlot extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group of QTL rectangles
   * @param params
   */

  constructor(params) {
    super(params);
    console.log('manhattan -> constructor', params);
    const b = this.parent.bounds;
    this.trackPos = params.position || 1;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: b.top,
      left: this.parent.bbGroup.bounds.right,
      width: 20, // manhattanInfo.width,
      height: b.height
    });
    if (this.parent.model.manhattanPlot !== null) {
      console.log('I\'ve got a manhattan', this.parent.model);
      let manhattanInfo = this.parent.model.manhattanPlot;

      // If data hasn't been attached to this map to plot, filter and attach it.
      if (manhattanInfo.data === undefined) {
        manhattanInfo.view = {
          start: 0,
          stop: manhattanInfo.max || 0
        };

        let baseData = this.parent.appState.sources.filter(model => {
          return model.id === this.parent.model.manhattanPlot.dataId;
        });
        console.log('manhattan dta', baseData);
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
      console.log('manhattan filterTest', manhattanInfo);

      //Draw manhattan plot
      let left = this.parent.bbGroup.bounds.right;

      //this.bounds = new Bounds({
      //  allowSubpixel: false,
      //  top: b.top,
      //  left: left,
      //  width: 50,
      //  height: b.height
      //});
      let mapGroup = new SceneGraphNodeGroup({parent: this});
      //    qtlGroup.lp = qtlConf.position || 1;
      this.addChild(mapGroup);
      mapGroup.bounds = new Bounds({
        top: 0,
        left: 0,
        width: 20,
        height: b.height
      });

      let fmData = [];
      this.qtlMarks = manhattanInfo.data.map(model => {

        model.coordinates = {
          start: model[manhattanInfo.posField],
          depth: model[manhattanInfo.pField]
        };

        let fm = new Dot({
          featureModel: model,
          parent: this.parent,
          bioMap: this.parent.model,
        });

        mapGroup.addChild(fm);
        let loc = {
          minY: 100,
          maxY: 110,
          minX: 100,
          maxX: 110,
          data: fm
        };
        mapGroup.locMap.insert(loc);
        fmData.push(loc);
        return fm;
      });
      this.locMap.load(fmData);
      console.log('manhattan Dots', fmData);
    }
  }

  /**
   *
   */

  get visible() {
    // return this.locMap.all();
    return this.locMap.all().concat([{data: this}]); // debugging statement to test track width bounds
  }

  // /**
  //  * Debug draw to check track positioning
  //  * @param ctx
  //  */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = '#ADD8E6';
    this.children.forEach(child => {
      let cb = child.globalBounds;
      // noinspection JSSuspiciousNameCombination
      // noinspection JSSuspiciousNameCombination
      ctx.fillRect(
        Math.floor(cb.left),
        Math.floor(cb.top),
        Math.floor(cb.width),
        Math.floor(cb.height)
      );
    });
    ctx.restore();
  }

  // /**
  //  * Get RTree children that are visible in the canvas' current zoom bounds
//   * @returns {Array}
//   */
//
  get hitMap() {
    // //return [];
    // let hits = [];
    // let childPos = this.children.map(child => {
    //   return child.children.map(qtlGroup => {
    //     return {
    //       minY: qtlGroup.globalBounds.top,
    //       maxY: qtlGroup.globalBounds.bottom,
    //       minX: qtlGroup.globalBounds.left,
    //       maxX: qtlGroup.globalBounds.right,
    //       data: qtlGroup
    //     };
    //   });
    // });
    // childPos.forEach(childArray => {
    //   hits = hits.concat(childArray);
    // });
    // return hits;
    return {
      minY: this.globalBounds.top,
      maxY: this.globalBounds.bottom,
      minX: this.globalBounds.left,
      maxX: this.globalBounds.right,
      data: this
    };

  };
}