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
import {manhattanRuler} from '../geometry/manhattanRuler';
import {translateScale} from '../../util/CanvasUtil';

export class ManhattanPlot extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group of QTL rectangles
   * @param params
   */

  constructor(params) {
    super(params,);
    console.log('manhattan -> constructor', params);
    const b = this.parent.bounds;
    this.trackPos = params.position || 1;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: 0,
      height: b.height
    });
    if (this.parent.model.manhattanPlot !== null) {
      let manhattanInfo = this.parent.model.manhattanPlot;

      // If data hasn't been attached to this map to plot, filter and attach it.
      if (manhattanInfo.data === undefined) {
        manhattanInfo.view = {
          start: 0,
          stop: manhattanInfo.maxValue || 0
        };

        let baseData = this.parent.appState.sources.filter(model => {
          return model.id === this.parent.model.manhattanPlot.dataId;
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
        width: manhattanInfo.width || 0,
        height: b.height
      });
      let mapGroup = new SceneGraphNodeGroup({parent: this, tags:'manhattan'});
      //    qtlGroup.lp = qtlConf.position || 1;
      this.addChild(mapGroup);

      mapGroup.bounds = new Bounds({
        top: 0,
        left: 0,
        width: manhattanInfo.width || 0,
        height: b.height
      });

      let fmData = [];

      this.manhattanMarks = manhattanInfo.data.map(model => {
        model.coordinates = {
          start: model[manhattanInfo.posField],
          depth: -Math.log10(model[manhattanInfo.pField])
        };
        if((model.coordinates.start > this.parent.model.view.base.stop) ||
          (model.coordinates.start < this.parent.model.view.base.start) ){ return; }

        let fm = new Dot({
          featureModel: model,
          parent: this.parent,
          bioMap: this.parent.model,
        });

        mapGroup.addChild(fm);

        let loc = {
          minY: model.coordinates.start,
          maxY: model.coordinates.start,
          minX: fm.globalBounds.left,
          maxX: fm.globalBounds.right,
          data: fm
        };
        this.mapGroup = mapGroup;

        mapGroup.locMap.insert(loc);
        fmData.push(loc);
        return fm;
      });



      let ruler ={
          minY: 0,
          maxY: 100000000,
          minX: this.globalBounds.left,
          maxX: this.globalBounds.right,
          data: new manhattanRuler({
          featureModel : this.parent.model.manhattanPlot,
          parent: this,
        })
      };

      this.locMap.insert(ruler);
      this.addChild(ruler.data);

      this.locMap.load(mapGroup.locMap.all());

      this.tags = ['manhattan'];
      console.log('manhattan Dots', this.locMap.all());
    }
  }

  /**
   *
   */

  get visible() {
    console.log('mhat vis');
    return this.locMap.all();
  }

  // /**
  //  * Debug draw to check track positioning
  //  * @param ctx
  //  */

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = 'green';
    let cb = this.globalBounds;
    let depth = 0;
    if(this.parent.model.manhattanPlot) {
      //Draw "ruler"
      ctx.strokeStyle='black';
      ctx.lineWidth = 2;

      //Baseline marks
      ctx.beginPath();

      ctx.moveTo(cb.left,cb.top);
      ctx.lineTo(cb.right, cb.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cb.left,cb.bottom);
      ctx.lineTo(cb.right, cb.bottom);
      ctx.stroke();


      //Ruler
      for (let i = 0; i <= this.parent.model.manhattanPlot.view.stop; i++) {
        if(i%this.parent.model.manhattanPlot.minorMark === 0 || i%this.parent.model.manhattanPlot.majorMark === 0) {
          depth = translateScale(i, {
            start: 0,
            stop: this.parent.model.manhattanPlot.width
          }, this.parent.model.manhattanPlot.view, false);
          ctx.beginPath();
          ctx.moveTo(cb.left + depth, cb.top);
          ctx.lineTo(cb.left + depth, cb.top - 10);
          ctx.stroke();
          if (i % this.parent.model.manhattanPlot.majorMark === 0) {
            ctx.font = '10px';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.fillText(String(i), cb.left + depth, cb.top - 11);
          }
        }
      }
      ctx.fillText('-log10(p)', cb.left + this.parent.model.manhattanPlot.width/2 , cb.top-25);

      // Reference lines

      if(this.parent.model.manhattanPlot.lines) {
        this.parent.model.manhattanPlot.lines.forEach(line =>{
          depth = translateScale(line.value, {
            start: 0,
            stop: this.parent.model.manhattanPlot.width
          }, this.parent.model.manhattanPlot.view, false);
          ctx.strokeStyle = line.color;
          ctx.lineWidth = line.width;
          ctx.beginPath();
          ctx.moveTo(cb.left + depth, cb.top);
          ctx.lineTo(cb.left + depth, cb.bottom);
          ctx.stroke();
        });
      }
    }
    ctx.restore();

    this.children.forEach(child => child.draw(ctx));
  }

  // /**
  //  * Get RTree children that are visible in the canvas' current zoom bounds
//   * @returns {Array}
//   */
//
  get hitMap() {
    return this.locMap.all();
    // let hits = [];
    // let childPos = this.mapGroup.map(child => {
    //     return {
    //       minY: child.globalBounds.top,
    //       maxY: child.globalBounds.bottom,
    //       minX: child.globalBounds.left,
    //       maxX: child.globalBounds.right,
    //       data: child
    //     };
    //   });
    //
    // childPos.forEach(childArray => {
    //   hits = hits.concat(childArray);
    // });
    // return hits;
  }
}