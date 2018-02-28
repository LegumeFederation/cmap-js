import {expect} from 'chai';
import {Bounds} from '../../../src/model/Bounds';
import {SceneGraphNodeBase} from '../../../src/canvas/node/SceneGraphNodeBase';

describe('SceneGraphNodeBase test', function () {
  describe('constructor', function () {
    it('should construct a new node', function () {
      let bounds = new Bounds({
        top: 1,
        bottom: 11,
        left: 10,
        right: 20,
        width: 10,
        height: 10
      });
      let parent = {};
      let params = {
        parent: parent,
        bounds: bounds,
        tags: ['test'],
        rotation: 45
      };
      let node = new SceneGraphNodeBase(params);
      expect(node.parent).to.equal(parent);
      expect(node.bounds).eql(bounds);
      expect(node.tags).eql(['test']);
      expect(node.rotation).to.equal(45);
    });
  });

  describe('custom getters', function () {
    it('should get children', function () {
      let p1 = baseParams('parent');
      let p2 = baseParams('child');
      let parentNode = new SceneGraphNodeBase(p1);
      let childNode = new SceneGraphNodeBase(p2);
      parentNode._children.push(childNode);
      expect(parentNode.children.length).to.equal(1);
      expect(parentNode.children[0]).to.equal(childNode);
    });
    it('should get bounds', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      let b1 = new Bounds({
        top: 0,
        bottom: 1,
        left: 0,
        right: 1,
        width: 1,
        height: 1
      });
      parentNode._bounds = b1;
      expect(parentNode.bounds).to.equal(b1);
    });
    it('should get rotation', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      parentNode._rotation = 90;
      expect(parentNode.rotation).to.equal(90);
    });
    it('should get tags', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      parentNode._tags[0] = 'testTag';
      expect(parentNode.tags).to.eql(['testTag']);
    });
    describe('get globalBounds', function () {
      it('should work with existing parent', function () {
        let parentNode = parentChildGenerator();
        let childNode = parentNode.children[0];
        parentNode.children.push(childNode);
        let result = childNode.globalBounds;
        expect(result.width).to.equal(childNode.bounds.width);
        expect(result.height).to.equal(childNode.bounds.height);
        expect(result.top).to.equal(childNode.bounds.top + parentNode.bounds.top);
        expect(result.bottom).to.equal(childNode.bounds.bottom + parentNode.bounds.top);
        expect(result.left).to.equal(childNode.bounds.left + parentNode.bounds.left);
        expect(result.right).to.equal(childNode.bounds.right + parentNode.bounds.left);
      });
      it('should work with no parent', function () {
        let p1 = baseParams('testNode');
        let parentNode = new SceneGraphNodeBase(p1);
        expect(parentNode.globalBounds).to.eql(parentNode.bounds);
      });
    });

    it('should get visible from children', function () {
      let parentNode = parentChildGenerator();
      let childNode = parentNode.children[0];
      let visNode = {
        minX: 1,
        maxX: 2,
        minY: 1,
        maxY: 2,
        data: 'empty'
      };
      childNode.locMap.insert(visNode);

      expect(parentNode.visible).to.eql(childNode.locMap.all());
    });

    it('should get hitMap from children', function () {
      let p1 = baseParams('testNode');
      let parentNode = new SceneGraphNodeBase(p1);
      let visNode = {
        minX: 1,
        maxX: 2,
        minY: 1,
        maxY: 2,
        data: 'empty'
      };
      parentNode.addChild({hitMap: [visNode]});
      expect(parentNode.hitMap).to.eql([visNode]);
    });
  });

  describe('custom setters', function () {
    it('should set children', function () {
      let p1 = baseParams('testNode');
      let p2 = baseParams('childNode');
      let parentNode = new SceneGraphNodeBase(p1);
      let childNode = new SceneGraphNodeBase(p2);
      expect(parentNode.children).to.eql([]);
      parentNode.children = [childNode];
      expect(parentNode.children).to.eql([childNode]);
    });

    it('should set bounds', function () {
      let p1 = baseParams('testNode');
      let parentNode = new SceneGraphNodeBase(p1);
      let b1 = new Bounds({
        top: 0,
        bottom: 1,
        left: 0,
        right: 1,
        width: 1,
        height: 1
      });
      expect(parentNode.bounds).to.not.equal(b1);
      parentNode.bounds = b1;
      expect(parentNode.bounds).to.equal(b1);
    });
    it('should set rotation', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      expect(parentNode.rotation).to.equal(45);
      parentNode.rotation = 90;
      expect(parentNode.rotation).to.equal(90);
    });
    it('should set tags', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      expect(parentNode.tags).to.eql(['parent']);
      parentNode.tags[0] = 'testTag';
      expect(parentNode.tags).to.eql(['testTag']);
    });

  });

  describe('public methods', function () {
    describe('translatePointToGlobal({x,y})', function () {
      it('should translate given {x,y} point to global coordinates', function () {
        let parentNode = parentChildGenerator();
        let childNode = parentNode.children[0];
        let point = childNode.translatePointToGlobal({x: 3, y: 8});
        expect(point).eql({x: 10, y: 12});
      });
    });

    describe('draw(ctx)', function () {
      it('should not throw an error when invoked', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = {
          draw: function () {
            return true;
          }
        };
        parentNode.addChild(childNode);
        expect(function () {
          parentNode.draw();
        }).to.not.throw();
      });
    });

    describe('removeChild(node)', function () {
      it('should remove the passed node from its parent', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = new SceneGraphNodeBase(p2);
        childNode.parent = parentNode;
        parentNode.children.push(childNode);
        expect(parentNode.children.length).to.equal(1);
        expect(parentNode.children[0]).to.equal(childNode);
        parentNode.removeChild(childNode);
        expect(parentNode.children.length).to.equal(0);
        expect(childNode.parent).to.equal(null);
      });

      it('should not throw an error is passed node has no parent', function () {
        let p2 = baseParams('child');
        let childNode = new SceneGraphNodeBase(p2);
        expect(function () {
          childNode.removeChild(childNode);
        }).to.not.throw();
        expect(childNode.parent).to.equal(null);
      });
    });

    describe('addChild(node))', function () {
      it('should add new child to new parent node', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = new SceneGraphNodeBase(p2);
        expect(parentNode.children.length).to.equal(0);
        parentNode.addChild(childNode);

        expect(parentNode.children.length).to.equal(1);
        expect(parentNode.children[0]).to.equal(childNode);
        expect(childNode.parent).to.equal(parentNode);
      });

      it('should not duplicate already existing children', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = new SceneGraphNodeBase(p2);
        expect(parentNode.children.length).to.equal(0);
        parentNode.addChild(childNode);
        parentNode.addChild(childNode);
        expect(parentNode.children.length).to.equal(1);
        expect(parentNode.children[0]).to.equal(childNode);
        expect(childNode.parent).to.equal(parentNode);
      });

      it('should transfer child node between two parent nodes', function () {
        let p1 = baseParams('parentOriginal');
        let p2 = baseParams('parentNew');
        let p3 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let secondParent = new SceneGraphNodeBase(p2);
        let childNode = new SceneGraphNodeBase(p3);
        parentNode.addChild(childNode);
        secondParent.addChild(childNode);
        expect(parentNode.children.length).to.equal(0);
        expect(secondParent.children.length).to.equal(1);
        expect(secondParent.children[0]).to.equal(childNode);
        expect(childNode.parent).to.equal(secondParent);
      });
    });
  });
});

const parentChildGenerator = function () {
  let parentNode = new SceneGraphNodeBase({
    parent: null,
    bounds: new Bounds({
      top: 2,
      bottom: 92,
      left: 3,
      right: 103,
      width: 100,
      height: 90
    })
  });
  let childNode = new SceneGraphNodeBase({
    parent: parentNode,
    bounds: new Bounds({
      top: 2,
      bottom: 5,
      left: 4,
      right: 9,
      width: 5,
      height: 3
    })
  });
  parentNode.children.push(childNode);
  return parentNode;
};

const baseParams = function (tag) {
  let bounds = new Bounds({
    top: 1,
    bottom: 11,
    left: 10,
    right: 20,
    width: 10,
    height: 10
  });
  return {
    bounds: bounds,
    tags: [tag],
    rotation: 45,
    parent: null
  };
};
