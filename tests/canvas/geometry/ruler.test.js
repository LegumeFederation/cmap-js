import o from "ospec";
import mq from 'mithril-query';
import { Bounds } from '../../../src/model/Bounds.js';
import { Ruler } from '../../../src/canvas/geometry/Ruler.js';

o.spec('Ruler test', function () {

  o('constructor works', function () {
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
    let config = {
      lineWeight: 0,
      padding: 5,
      width: 10
    };
    parent.bounds = new Bounds({ top: 0, left: 0, width: 20, height: 20 });
    parent.backbone = {};
    parent.backbone.bounds = bounds;
    let ruler = new Ruler({ parent, bioMap: bioMap, config: config });
    let rulerBounds = new Bounds({
      top: parent.bounds.top,
      left: bounds.left - 15,
      width: 10,
      height: bounds.height,
      allowSubpixel: false
    });

    o(ruler.parent).equals(parent);
    o(ruler.mapCoordinates).equals(bioMap.view);
    o(ruler.pixelScaleFactor).equals(bioMap.view.pixelScaleFactor);

    // Compare the properties of the bounds individually
    o(ruler.bounds._top).equals(rulerBounds._top);
    o(ruler.bounds._left).equals(rulerBounds._left);
    o(ruler.bounds._right).equals(rulerBounds._right);
    o(ruler.bounds._bottom).equals(rulerBounds._bottom);
    o(ruler.bounds._width).equals(rulerBounds._width);
    o(ruler.bounds._height).equals(rulerBounds._height);
    o(ruler.bounds.allowSubpixel).equals(rulerBounds.allowSubpixel);
  });

  o('get visible', function () {
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
    parent.bounds = new Bounds({ top: 0, left: 0, width: 20, height: 20 });
    parent.backbone = {};
    parent.backbone.bounds = bounds;
    let ruler = new Ruler({ parent, bioMap: model, config: {} });

    o(ruler.visible).deepEquals({ data: ruler });
  });

});
