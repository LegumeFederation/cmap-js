import {expect} from 'chai';
import mq from '../../ui/mithrilQuerySetup';
import {Bounds} from '../../../src/model/Bounds';
import {BioMap} from '../../../src/canvas/canvas/BioMap';

describe('BioMap test', function () {
  describe('constructor', function () {
    it('should construct a new node', function () {
      let gestureRegex = {
        pan: new RegExp('^pan'),
        pinch: new RegExp('^pinch'),
        tap: new RegExp('^tap'),
        wheel: new RegExp('^wheel')
      };
      let params = baseParams();
      // mock up test constructor to prevent _layout propegation blocking
      // tests
      let testBioMap = BioMap;
      testBioMap.prototype._layout = function (layoutBounds) {
        return true;
      };
      let node = new testBioMap(params);

      expect(node.model.visible).to.eql(params.bioMapModel.coordinates);
      expect(node.model.view.base).to.eql(params.bioMapModel.coordinates);
      expect(node.model.view.visible).to.eql(params.bioMapModel.coordinates);
      expect(node.appState).to.equal(params.appState);
      expect(node.verticalScale).to.equal(0);
      expect(node.backbone).to.equal(null);
      expect(node.featureMarks).to.eql([]);
      expect(node.featureLabels).to.eql([]);
      expect(node._gestureRegex).to.eql(gestureRegex);
    });
  });

  describe('custom getters', function () {
    describe('get visible', function () {
      it('should return visible noded if children have visible', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) {
          return true;
        };
        let node = new testBioMap(p1);
        node.children[0] = {visible: 'visibleTest'};
        expect(node.visible).to.eql(['visibleTest']);
      });
      it('should return nothing if no children are visible', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) {
          return true;
        };
        let node = new testBioMap(p1);
        expect(node.visible).to.eql([]);
      });
    });
    describe('get hitMap', function () {
      it('should return rbush tree of visible objects', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) {
          return true;
        };
        let node = new testBioMap(p1);
        expect(node.hitMap).to.eql(node.locMap);
      });
    });
  });
//
//  describe('mithril lifecycle events', function() {
//    it('should generate approprate output', function() {
//      let p1 = baseParams();
//      let parentNode = new SceneGraphNodeCanvas(p1);
//			let domBounds =  new Bounds({
//    	  top: 1,
//    	  bottom: 11,
//    	  left: 10,
//    	  right: 20,
//    	  width: 10,
//    	  height: 10
//    	});
//      let out = mq(parentNode,{domBounds: domBounds});
//      expect(out.vnode.tag).to.eql(parentNode);
//			out.should.have('canvas');
//			out.should.have('.cmap-canvas');
//			out.should.have('.cmap-biomap');
//    });
//  });
//
//  describe('public methods', function() {
//    describe('draw(ctx)', function() {
//      it('should return if no context', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//        expect(function() {parentNode.draw()}).to.not.throw();
//      });
//      it('should return if no bounds', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				parentNode.context2d = {
//					clearRect : ()=>{return true;},
//					save : () => {return true;},
//					restore : () => {return true;},
//				};
//        expect(function() {parentNode.draw()}).to.not.throw();
//      });
//      it('should propegate if both domBounds and context', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				parentNode.context2d = {
//					clearRect : ()=>{return true;},
//					save : () => {return true;},
//					restore : () => {return true;},
//				};
//				parentNode.canvas = {width:10, height:10};
//				let domBounds =  new Bounds({
//    		  top: 1,
//    		  left: 10,
//    		  width: 10,
//    		  height: 10
//    		});
//				parentNode.domBounds = domBounds;
//				parentNode.bounds = domBounds;
//				parentNode.draw();
//				expect(parentNode.lastDrawnCanvasBounds).to.eql(domBounds);
//      });
//    });
//		describe('handleGesture(evt)', function() {
//      it('should recognise pan', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				let evt = {type:'pan'};
//        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onPan(evt));
//      });
//
//      it('should recognise tap', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				let evt = {type:'tap'};
//        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onTap(evt));
//      });
//
//      it('should recognise wheel', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				let evt = {type:'wheel'};
//        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onZoom(evt));
//      });
//
//      it('should recognise pinch', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				let evt = {type:'pinch'};
//        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onZoom(evt));
//      });
//
//      it('should ignore invalid event', function() { 
//        let p1 = baseParams();
//        let parentNode = new SceneGraphNodeCanvas(p1);
//				let evt = {type:'quack'};
//        expect(parentNode.handleGesture(evt)).to.equal(false);
//      });
//		});
//	});
//
  describe('private methods', function () {
//    describe('_onZoom(evt)', function() {
//      it('should increase zoom on negative deltaY', function() { 
//    	  let p1 = baseParams();
//				let testBioMap = BioMap;
//				testBioMap.prototype._layout = function(layoutBounds){return true;};
//				testBioMap.prototype._draw = function(layoutBounds){return true;};
//				let node = new testBioMap(p1);
//				let evt = {deltaY : -1};
//				node.backbone = {loadLabelMap : function(){return true;} };
//				document.getElementsByClassName = function(){return [];};
//				let zoom = node._onZoom(evt);
//				expect(zoom).to.equal(true);
//        expect(node.verticalScale).to.equal(0.5);
//				expect(node.model.view.visible.start).to.equal(1.5);
//				expect(node.model.view.visible.stop).to.equal(99.5);
//      });
//      it('should decrease zoom on positive deltaY', function() { 
//    	  let p1 = baseParams();
//				let testBioMap = BioMap;
//				testBioMap.prototype._layout = function(layoutBounds){return true;};
//				testBioMap.prototype._draw = function(layoutBounds){return true;};
//				let node = new testBioMap(p1);
//				node.model.view.visible = { start: 1.5, stop: 99.5};
//				let evt = {deltaY : 1};
//				node.backbone = {loadLabelMap : function(){return true;} };
//				document.getElementsByClassName = function(){return [];};
//				let zoom = node._onZoom(evt);
//				expect(zoom).to.equal(true);
//        expect(node.verticalScale).to.equal(0);
//				expect(node.model.view.visible.start).to.equal(1);
//				expect(node.model.view.visible.stop).to.equal(100);
//      });
//      it('should not increase past maximum zoom out', function() { 
//    	  let p1 = baseParams();
//				let testBioMap = BioMap;
//				testBioMap.prototype._layout = function(layoutBounds){return true;};
//				testBioMap.prototype._draw = function(layoutBounds){return true;};
//				let node = new testBioMap(p1);
//				let evt = {deltaY : 1};
//				node.backbone = {loadLabelMap : function(){return true;} };
//
//				document.getElementsByClassName = function(){return [];};
//				let zoom = node._onZoom(evt);
//				expect(zoom).to.equal(true);
//        expect(node.verticalScale).to.equal(0);
//				expect(node.model.view.visible.start).to.equal(1);
//				expect(node.model.view.visible.stop).to.equal(100);
//      });
//      it('should not set stop above start', function() { 
//    	  let p1 = baseParams();
//				let testBioMap = BioMap;
//				testBioMap.prototype._layout = function(layoutBounds){return true;};
//				testBioMap.prototype._draw = function(layoutBounds){return true;};
//				let node = new testBioMap(p1);
//				node.model.view.visible = { start: 1.5, stop: 1.5};
//				node.model.view.base = {start: 1.5, stop: 1.5};
//				let evt = {deltaY : -1};
//				node.backbone = {loadLabelMap : function(){return true;} };
//				document.getElementsByClassName = function(){return [];};
//				let zoom = node._onZoom(evt);
//				expect(zoom).to.equal(true);
//        expect(node.verticalScale).to.equal(0);
//				expect(node.model.view.visible.start).to.equal(1.5);
//				expect(node.model.view.visible.stop).to.equal(1.5);
//      });
//    });

    describe('_onTap(evt)', function () {
      it('should be able to calculate a tap event', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) {
          return true;
        };
        testBioMap.prototype._draw = function (layoutBounds) {
          return true;
        };
        let node = new testBioMap(p1);
        let evt = {srcEvent: {pageX: 0, pageY: 0}};
        //let node.canvas = {offsetLeft:0, scrollLeft:0,offsetTop:0,scrollTop:0,offsetParent:null};
        node.backbone = {
          loadLabelMap: function () {
            return true;
          }
        };
        document.getElementsByClassName = function () {
          return [];
        };
        let tap = node._onTap(evt);
        expect(tap).to.equal(true);
      });
    });

    describe('_loadHitMap()', function () {
      it('should load a new hit map', function () {
        let p1 = baseParams();
        let testBioMap = BioMap;
        testBioMap.prototype._layout = function (layoutBounds) {
          return true;
        };
        testBioMap.prototype._draw = function (layoutBounds) {
          return true;
        };
        let node = new testBioMap(p1);
        let hit = {minX: 1, maxX: 1, minY: 1, maxY: 1, data: 'test'};
        node.addChild({hitMap: hit});
        node._loadHitMap();
        //let node.canvas = {offsetLeft:0, scrollLeft:0,offsetTop:0,scrollTop:0,offsetParent:null};
        expect(node.locMap.all()).to.eql([hit]);
      });
    });
  });
});

const baseParams = function () {
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
        rulerSteps: 100
      }
    },
    appState: {},
    layoutBounds: bounds
  };
};
