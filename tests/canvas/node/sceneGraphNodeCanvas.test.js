import o from 'ospec';
import mq from 'mithril-query';
import { Bounds } from '../../../src/model/Bounds.js';
import { SceneGraphNodeCanvas } from '../../../src/canvas/node/SceneGraphNodeCanvas.js';

o.spec('SceneGraphNodeCanvas test', function () {
  o.spec('constructor', function () {
    o('should construct a new node', function () {
      let params = {
        model: 'model',
        appState: 'appState'
      };
      let gestureRegex = {
        pan: new RegExp('^pan'),
        pinch: new RegExp('^pinch'),
        tap: new RegExp('^tap'),
        wheel: new RegExp('^wheel')
      };
      let node = new SceneGraphNodeCanvas(params);
      o(node.model).equals(params.model);
      o(node.appState).equals(params.appState);
      o(node.verticalScale).equals(1);
      o(node._gestureRegex.wheel.toString()).equals(gestureRegex.wheel.toString());
    });
  });

  o.spec('custom getters', function () {
    o.spec('get selected', function () {
      o('should return true if this canvas is selected', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        parentNode.appState.selection.bioMaps[0] = parentNode;
        o(parentNode.selected).equals(true);
      });
      
      o('should return false if canvas is not selected', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        o(parentNode.selected).equals(false);
      });
    });
  });

  o.spec('mithril lifecycle events', function () {
    o('should generate appropriate output', function () {
      let p1 = baseParams();
      let parentNode = new SceneGraphNodeCanvas(p1);
      let domBounds = new Bounds({
        top: 1,
        bottom: 11,
        left: 10,
        right: 20,
        width: 10,
        height: 10
      });
      let out = mq(parentNode, { domBounds: domBounds });
      o(out.vnode.tag).equals(parentNode);
      out.should.have('canvas');
      out.should.have('.cmap-canvas');
      out.should.have('.cmap-biomap');
    });
  });

  o.spec('public methods', function () {
    o.spec('draw(ctx)', function () {
      o('should return if no context', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        o(() => {
          parentNode.draw();
        }).notThrows();
      });

      o('should return if no bounds', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        parentNode.context2d = {
          clearRect: () => true,
          save: () => true,
          restore: () => true
        };
        o(() => {
          parentNode.draw();
        }).notThrows();
      });

      o('should propagate if both domBounds and context', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        parentNode.context2d = {
          clearRect: () => true,
          save: () => true,
          restore: () => true
        };
        parentNode.canvas = { width: 10, height: 10 };
        let domBounds = new Bounds({
          top: 1,
          left: 10,
          width: 10,
          height: 10
        });
        parentNode.domBounds = domBounds;
        parentNode.bounds = domBounds;
        parentNode.draw();
        o(parentNode.lastDrawnCanvasBounds).deepEquals(domBounds);
      });
    });

    o.spec('handleGesture(evt)', function () {
      o('should recognize pan', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'pan' };
        o(parentNode.handleGesture(evt)).equals(parentNode._onPan(evt));
      });

      o('should recognize tap', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'tap' };
        o(parentNode.handleGesture(evt)).equals(parentNode._onTap(evt));
      });

      o('should recognize wheel', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'wheel' };
        o(parentNode.handleGesture(evt)).equals(parentNode._onZoom(evt));
      });

      o('should recognize pinch', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'pinch' };
        o(parentNode.handleGesture(evt)).equals(parentNode._onZoom(evt));
      });

      o('should ignore invalid event', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'quack' };
        o(parentNode.handleGesture(evt)).equals(false);
      });
    });
  });

  o.spec('private methods', function () {
    o.spec('_onZoom(evt)', function () {
      o('should propagate zoom event', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'quack' };
        o(parentNode._onZoom(evt)).equals(false);
      });
    });

    o.spec('_onTap(evt)', function () {
      o('should not block tap event', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'quack' };
        o(parentNode._onTap(evt)).equals(false);
      });
    });

    o.spec('_onPan(evt)', function () {
      o('should not block pan event if direction is not provided', function () {
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        let evt = { type: 'quack' };
        o(parentNode._onPan(evt)).equals(false);
      });
    });
  });
});

const baseParams = function () {
  return {
    model: {},
    appState: { selection: { bioMaps: [] } }
  };
};
