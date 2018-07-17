/**
 * QtlTrack
 * A SceneGraphNode representing a collection of QTLs.
 *
 * @extends SceneGraphNodeTrack
 */
import {SceneGraphNodeTrack} from '../node/SceneGraphNodeTrack';
import {LabelTrack} from './LabelTrack';
import {Bounds} from '../../model/Bounds';
import {QTL} from '../geometry/QTL';


export class QtlTrack extends SceneGraphNodeTrack {

  /**
   * Constructor - sets up a track that's a group of QTL rectangles
   * @param params
   */

  /**
   * TODO: Allow for subtracks
   */

  constructor(params) {
    super(params);

    this.filteredFeatures = [];
    let b = this.parent.bounds;
    this.bounds = new Bounds({
      allowSubpixel: false,
      top: 0,
      left: 0,
      width: this.parent.model.config.qtl.trackMinWidth,
      height: b.height
    });

   let qtlConf = params.config;
    for( let key in this.parent.model.config.qtl){
      if(!qtlConf.hasOwnProperty(key)){
        qtlConf[key] = this.parent.model.config.qtl[key];
      }
    }

   qtlConf.filters.forEach( (filter,order) => {
      let test = this.parent.model.features.filter( model => {
        return model.tags[0].match(filter) !== null;
      });
      if(test.length === 0){
        // get rid of any tags that don't actually get used
        qtlConf.filters.splice(order,1);
      } else {
        this.filteredFeatures = this.filteredFeatures.concat(test);
      }
    });

    this.filteredFeatures.sort((a,b)=>{return a.coordinates.start - b.coordinates.start;});
    let fmData = [];


    this.maxLoc = 0;
    this.featureData = this.filteredFeatures.map( model => {
      let fm = new QTL ({
        featureModel: model,
        parent: this,
        bioMap: this.parent.model,
        initialConfig: qtlConf,
        config: this.parent.model.config.qtl
      });
      this.addChild(fm);

      let loc = {
        minY: model.coordinates.start,
        maxY: model.coordinates.stop,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data:fm
      };

      this.locMap.insert(loc);

      fmData.push(loc);

      if(fm.globalBounds.right > this.globalBounds.right){
        this.bounds.right = fm.globalBounds.right - this.globalBounds.left;
      }

      return fm;
    });

    this.model= this.parent.model;
    this.parent.labels = new LabelTrack({parent:this, config:params.config});

    this.locMap.clear();
    this.locMap.load(fmData);
  }

  /**
   *
   */

  get visible() {
   // let visible = [];
   // this.children.forEach(child => {
   //   visible = visible.concat(child.locMap.all());
   // });
   //
   // return visible;
    return this.locMap.all();
   // return this.locMap.all().concat([{data:this}]); // debugging statement to test track width bounds
  }

  /**
   * Debug draw to check track positioning
   * @param ctx
   */

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

  /**
   * Get RTree children that are visible in the canvas' current zoom bounds
   * @returns {Array}
   */

  get hitMap() {
    //return this.locMap.all();
    return this.children.map(child => {
      return {
        minY: child.globalBounds.top,
        maxY: child.globalBounds.bottom,
        minX: child.globalBounds.left,
        maxX: child.globalBounds.right,
        data: child
      };
    });
  }
}
