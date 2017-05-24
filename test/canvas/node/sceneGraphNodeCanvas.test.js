import {expect} from 'chai';
import mq from '../../ui/mithrilQuerySetup';
import {Bounds} from '../../../src/model/Bounds';
import {SceneGraphNodeCanvas} from '../../../src/canvas/node/SceneGraphNodeCanvas';

describe('SceneGraphNodeCanvas test', function() {
  describe('constructor', function() {
    it('should construct a new node', function() {
      let params = {
        model: 'model',
        appState: 'appState'
      };
      let gestureRegex = {
    	  pan:   new RegExp('^pan'),
    	  pinch: new RegExp('^pinch'),
    	  tap:   new RegExp('^tap'),
    	  wheel: new RegExp('^wheel')
    	};
      let node = new SceneGraphNodeCanvas(params);
      expect(node.model).to.equal(params.model);
      expect(node.appState).to.equal(params.appState);
      expect(node.verticalScale).to.equal(1);
      expect(node._gestureRegex).to.eql(gestureRegex);
    });
  });

  describe('custom getters', function() {
		describe('get selected', function() {
    	it('should return true if this canvas is seleted', function() {
    	  let p1 = baseParams();
    	  let parentNode = new SceneGraphNodeCanvas(p1);
				parentNode.appState.selection.bioMaps[0] = parentNode;
    	  expect(parentNode.selected).to.equal(true);
    	});
    	it('should return false if canvas is not selected', function() {
    	  let p1 = baseParams();
    	  let parentNode = new SceneGraphNodeCanvas(p1);
    	  expect(parentNode.selected).to.equal(false);
    	});
		});
  });

  describe('mithril lifecycle events', function() {
    it('should generate approprate output', function() {
      let p1 = baseParams();
      let parentNode = new SceneGraphNodeCanvas(p1);
			let domBounds =  new Bounds({
    	  top: 1,
    	  bottom: 11,
    	  left: 10,
    	  right: 20,
    	  width: 10,
    	  height: 10
    	});
      let out = mq(parentNode,{domBounds: domBounds});
      expect(out.vnode.tag).to.eql(parentNode);
			out.should.have('canvas');
			out.should.have('.cmap-canvas');
			out.should.have('.cmap-biomap');
    });
  });

  describe('public methods', function() {
    describe('draw(ctx)', function() {
      it('should return if no context', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
        expect(function() {parentNode.draw()}).to.not.throw();
      });
      it('should return if no bounds', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				parentNode.context2d = {
					clearRect : ()=>{return true;},
					save : () => {return true;},
					restore : () => {return true;},
				};
        expect(function() {parentNode.draw()}).to.not.throw();
      });
      it('should propegate if both domBounds and context', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				parentNode.context2d = {
					clearRect : ()=>{return true;},
					save : () => {return true;},
					restore : () => {return true;},
				};
				parentNode.canvas = {width:10, height:10};
				let domBounds =  new Bounds({
    		  top: 1,
    		  left: 10,
    		  width: 10,
    		  height: 10
    		});
				parentNode.domBounds = domBounds;
				parentNode.bounds = domBounds;
				parentNode.draw();
				expect(parentNode.lastDrawnCanvasBounds).to.eql(domBounds);
      });
    });
		describe('handleGesture(evt)', function() {
      it('should recognise pan', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'pan'};
        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onPan(evt));
      });

      it('should recognise tap', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'tap'};
        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onTap(evt));
      });

      it('should recognise wheel', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'wheel'};
        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onZoom(evt));
      });

      it('should recognise pinch', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'pinch'};
        expect(parentNode.handleGesture(evt)).to.eql(parentNode._onZoom(evt));
      });

      it('should ignore invalid event', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'quack'};
        expect(parentNode.handleGesture(evt)).to.equal(false);
      });
		});
	});

  describe('private methods', function() {
    describe('_onZoom(evt)', function() {
      it('should propegate zoom event', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'quack'};
        expect(parentNode._onZoom(evt)).to.equal(false);
      });
    });

    describe('_onTap(evt)', function() {
      it('should not block tap event', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'quack'};
        expect(parentNode._onTap(evt)).to.equal(false);
      });
    });

    describe('_onPan(evt)', function() {
      it('should not block pan event if direction is not provided', function() { 
        let p1 = baseParams();
        let parentNode = new SceneGraphNodeCanvas(p1);
				let evt = {type:'quack'};
        expect(parentNode._onPan(evt)).to.equal(false);
      });
    });
	});
});

const baseParams = function() {
  return {
		model: {},
		appState: { selection: { bioMaps:[] } } 
  }
};
