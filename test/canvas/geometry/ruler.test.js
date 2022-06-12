import {expect} from 'chai';
import {Bounds} from '../../../src/model/Bounds';
import {Ruler} from '../../../src/canvas/geometry/Ruler';

describe('Ruler test', function () {

  it('constructor works', function () {
    let bounds = new Bounds({
      top: 1,
      bottom: 11,
      left: 10,
      right: 20,
      width: 10,
      height: 10
    });
    let parent = {};
    let bioMap = {
      view: {
        base: {
          start: 0,
          stop: 100
        },
        visible: {
          start: 0,
          stop: 100
        },
        backbone: bounds,
        pixelScaleFactor: 1
      }
    };
    // cannot import defaultConfig from BioMapConfigModel due to mithril;
    // hard-coding relevant 'ruler' property defaults here
    let config = {
      lineWeight: 0,
      padding: 5,
      width: 10
    };
    parent.bounds = new Bounds({top: 0, left: 0, width: 20, height: 20});
    parent.backbone = {};
    parent.backbone.bounds = bounds;
    let ruler = new Ruler({parent, bioMap: bioMap, config: config});
    let rulerBounds = new Bounds({
      top: parent.bounds.top,
      left: bounds.left - 15,
      width: 10,
      height: bounds.height,
      allowSubpixel: false
    });
    expect(ruler.parent).to.equal(parent);
    expect(ruler.mapCoordinates).to.equal(bioMap.view);
    expect(ruler.pixelScaleFactor).to.equal(bioMap.view.pixelScaleFactor);
    expect(ruler.bounds).to.eql(rulerBounds);
  });
  it('get visible', function () {
    let bounds = new Bounds({
      top: 1,
      bottom: 11,
      left: 10,
      right: 20,
      width: 10,
      height: 10
    });
    let parent = {};
    let model = {
      view: {
        base: {
          start: 0,
          stop: 100
        },
        visible: {
          start: 0,
          stop: 100
        },
        backbone: bounds,
        pixelScaleFactor: 1
      }
    };
    parent.bounds = new Bounds({top: 0, left: 0, width: 20, height: 20});
    parent.backbone = {};
    parent.backbone.bounds = bounds;
    let ruler = new Ruler({parent, bioMap: model, config: {}});
    let rulerBounds = new Bounds({
      top: parent.bounds.top,
      left: bounds.left - 15,
      width: 10,
      height: bounds.height,
      allowSubpixel: false
    });
    expect(ruler.visible).to.eql({data: ruler});
  });

});

