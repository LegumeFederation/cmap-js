import o from 'ospec';
import { Bounds } from '../../../src/model/Bounds.js';
import { SceneGraphNodeBase } from '../../../src/canvas/node/SceneGraphNodeBase.js';

o.spec('SceneGraphNodeBase test', function () {
  o.spec('constructor', function () {
    o('should construct a new node', function () {
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
      o(node.parent).equals(parent);
      o(node.bounds).deepEquals(bounds);
      o(node.tags).deepEquals(['test']);
      o(node.rotation).equals(45);
    });
  });

  o.spec('custom getters', function () {
    o('should get children', function () {
      let p1 = baseParams('parent');
      let p2 = baseParams('child');
      let parentNode = new SceneGraphNodeBase(p1);
      let childNode = new SceneGraphNodeBase(p2);
      parentNode._children.push(childNode);
      o(parentNode.children.length).equals(1);
      o(parentNode.children[0]).equals(childNode);
    });

    o('should get bounds', function () {
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
      o(parentNode.bounds).equals(b1);
    });

    o('should get rotation', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      parentNode._rotation = 90;
      o(parentNode.rotation).equals(90);
    });

    o('should get tags', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      parentNode._tags[0] = 'testTag';
      o(parentNode.tags).deepEquals(['testTag']);
    });

    o.spec('get globalBounds', function () {
      o('should work with existing parent', function () {
        let parentNode = parentChildGenerator();
        let childNode = parentNode.children[0];
        parentNode.children.push(childNode);
        let result = childNode.globalBounds;
        o(result.width).equals(childNode.bounds.width);
        o(result.height).equals(childNode.bounds.height);
        o(result.top).equals(childNode.bounds.top + parentNode.bounds.top);
        o(result.bottom).equals(childNode.bounds.bottom + parentNode.bounds.top);
        o(result.left).equals(childNode.bounds.left + parentNode.bounds.left);
        o(result.right).equals(childNode.bounds.right + parentNode.bounds.left);
      });

      o('should work with no parent', function () {
        let p1 = baseParams('testNode');
        let parentNode = new SceneGraphNodeBase(p1);
        o(parentNode.globalBounds).deepEquals(parentNode.bounds);
      });
    });

    o('should get visible from children', function () {
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

      o(parentNode.visible).deepEquals(childNode.locMap.all());
    });

    o('should get hitMap from children', function () {
      let p1 = baseParams('testNode');
      let parentNode = new SceneGraphNodeBase(p1);
      let visNode = {
        minX: 1,
        maxX: 2,
        minY: 1,
        maxY: 2,
        data: 'empty'
      };
      parentNode.addChild({ hitMap: [visNode] });
      o(parentNode.hitMap).deepEquals([visNode]);
    });
  });

  o.spec('custom setters', function () {
    o('should set children', function () {
      let p1 = baseParams('testNode');
      let p2 = baseParams('childNode');
      let parentNode = new SceneGraphNodeBase(p1);
      let childNode = new SceneGraphNodeBase(p2);
      o(parentNode.children).deepEquals([]);
      parentNode.children = [childNode];
      o(parentNode.children).deepEquals([childNode]);
    });

    o('should set bounds', function () {
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
      o(parentNode.bounds).notEquals(b1);
      parentNode.bounds = b1;
      o(parentNode.bounds).equals(b1);
    });

    o('should set rotation', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      o(parentNode.rotation).equals(45);
      parentNode.rotation = 90;
      o(parentNode.rotation).equals(90);
    });

    o('should set tags', function () {
      let p1 = baseParams('parent');
      let parentNode = new SceneGraphNodeBase(p1);
      o(parentNode.tags).deepEquals(['parent']);
      parentNode.tags[0] = 'testTag';
      o(parentNode.tags).deepEquals(['testTag']);
    });
  });

  o.spec('public methods', function () {
    o.spec('translatePointToGlobal({x,y})', function () {
      o('should translate given {x,y} point to global coordinates', function () {
        let parentNode = parentChildGenerator();
        let childNode = parentNode.children[0];
        let point = childNode.translatePointToGlobal({ x: 3, y: 8 });
        o(point).deepEquals({ x: 10, y: 12 });
      });
    });

    o.spec('draw(ctx)', function () {
      o('should not throw an error when invoked', function () {
        let p1 = baseParams('parent');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = {
          draw: function () {
            return true;
          }
        };
        parentNode.addChild(childNode);
        o(() => {
          parentNode.draw();
        }).notThrows();
      });
    });

    o.spec('removeChild(node)', function () {
      o('should remove the passed node from its parent', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = new SceneGraphNodeBase(p2);
        childNode.parent = parentNode;
        parentNode.children.push(childNode);
        o(parentNode.children.length).equals(1);
        o(parentNode.children[0]).equals(childNode);
        parentNode.removeChild(childNode);
        o(parentNode.children.length).equals(0);
        o(childNode.parent).equals(null);
      });

      o('should not throw an error if passed node has no parent', function () {
        let p2 = baseParams('child');
        let childNode = new SceneGraphNodeBase(p2);
        o(() => {
          childNode.removeChild(childNode);
        }).notThrows();
        o(childNode.parent).equals(null);
      });
    });

    o.spec('addChild(node)', function () {
      o('should add new child to new parent node', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = new SceneGraphNodeBase(p2);
        o(parentNode.children.length).equals(0);
        parentNode.addChild(childNode);
        o(parentNode.children.length).equals(1);
        o(parentNode.children[0]).equals(childNode);
        o(childNode.parent).equals(parentNode);
      });

      o('should not duplicate already existing children', function () {
        let p1 = baseParams('parent');
        let p2 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let childNode = new SceneGraphNodeBase(p2);
        o(parentNode.children.length).equals(0);
        parentNode.addChild(childNode);
        parentNode.addChild(childNode);
        o(parentNode.children.length).equals(1);
        o(parentNode.children[0]).equals(childNode);
        o(childNode.parent).equals(parentNode);
      });

      o('should transfer child node between two parent nodes', function () {
        let p1 = baseParams('parentOriginal');
        let p2 = baseParams('parentNew');
        let p3 = baseParams('child');
        let parentNode = new SceneGraphNodeBase(p1);
        let secondParent = new SceneGraphNodeBase(p2);
        let childNode = new SceneGraphNodeBase(p3);
        parentNode.addChild(childNode);
        secondParent.addChild(childNode);
        o(parentNode.children.length).equals(0);
        o(secondParent.children.length).equals(1);
        o(secondParent.children[0]).equals(childNode);
        o(childNode.parent).equals(secondParent);
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
