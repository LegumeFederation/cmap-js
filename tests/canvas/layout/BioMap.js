import o from 'ospec';
import {Bounds} from '../../../src/model/Bounds.js';
import {BioMap} from '../../../src/canvas/canvas/BioMap.js';

o.spec('BioMap test', function () {
  o.spec('constructor', function () {
    o('should construct a new node', function () {
      let gestureRegex = {
        pan: new RegExp('^pan'),
        pinch: new RegExp('^pinch'),
        tap: new RegExp('^tap'),
        wheel: new RegExp('^wheel')
      };
      let params = baseParams();
      let testBioMap = BioMap;
      testBioMap.prototype._layout = function (layoutBounds) { // eslint-disable-line no-unused-vars
        return true;
      };
      let node = new testBioMap(params);

      o(node.model.visible).deepEquals(params.bioMapModel.coordinates);
      o(node.model.view.base).deepEquals(params.bioMapModel.coordinates);
      o(node.model.view.visible).deepEquals(params.bioMapModel.coordinates);
      o(node.appState).equals(params.appState);
      o(node.verticalScale).equals(0);
      o(node.backbone).equals(null);
      o(node.featureMarks).deepEquals([]);
      o(node.featureLabels).deepEquals([]);
      o(node._gestureRegex.wheel.toString()).equals(gestureRegex.wheel.toString());
    });
  });

  o.spec('custom getters', function () {
    o.spec('get visible', function () {
      o('should return visible nodes if children have visible', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        let node = new testBioMap(p1);
        node.children[0] = { visible: 'visibleTest' };
        o(node.visible).deepEquals(['visibleTest']);
      });

      o('should return nothing if no children are visible', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        let node = new testBioMap(p1);
        o(node.visible).deepEquals([]);
      });
    });

    o.spec('get hitMap', function () {
      o('should return rbush tree of visible objects', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        let node = new testBioMap(p1);
        o(node.hitMap).deepEquals(node.locMap);
      });
    });
  });

  o.spec('private methods', function () {
    o.spec('_onTap(evt)', function () {
      o('should be able to calculate a tap event', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        testBioMap.prototype._draw = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        let node = new testBioMap(p1);
        let evt = { srcEvent: { pageX: 0, pageY: 0 } };
        node.backbone = {
          loadLabelMap: function () {
            return true;
          }
        };
        document.getElementsByClassName = function () {
          return [];
        };
        let tap = node._onTap(evt);
        o(tap).equals(true);
      });
    });

    o.spec('_loadHitMap()', function () {
      o('should load a new hit map', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        testBioMap.prototype._draw = function (layoutBounds) { // eslint-disable-line no-unused-vars
          return true;
        };
        let node = new testBioMap(p1);
        let hit = { minX: 1, maxX: 1, minY: 1, maxY: 1, data: 'test' };
        node.addChild({ hitMap: hit });
        node._loadHitMap();
        o(node.locMap.all()).deepEquals([hit]);
      });
    });
  });
});

function baseParams() {
  let bounds = new Bounds({
    top: 1,
    left: 10,
    width: 10,
    height: 10
  });

  return {
    bioMapModel: {
      coordinates: {
        start: 1,
        stop: 100
      },
      config: {
        ruler: {
          steps: 100
        }
      }
    },
    appState: {},
    layoutBounds: bounds,
    initialView: []
  };
}
