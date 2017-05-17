import {expect} from 'chai';
import {Bounds} from '../../../src/model/Bounds';
import {SceneGraphNodeBase} from '../../../src/canvas/node/SceneGraphNodeBase';

describe('SceneGraphNodeBase test', function() {

  it('constructor works', function() {
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

  it('get globalBounds', function() {
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

  it('translatePointToGlobal', function() {
    let parentNode = parentChildGenerator();
    let childNode = parentNode.children[0];
    let point = childNode.translatePointToGlobal({x: 3, y: 8});
    expect(point).eql({x: 10, y: 12});
  });

  it('removeChild', function() {
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
      bounds: bounds,
      tags: ['test'],
      rotation: 45
    };
    let parentNode = new SceneGraphNodeBase(params);
    let childNode = new SceneGraphNodeBase(params);
    childNode.parent = parentNode;
    parentNode.children.push(childNode);
    expect(parentNode.children.length).to.equal(1);
    expect(parentNode.children[0]).to.equal(childNode);
    parentNode.removeChild(childNode);
    expect(parentNode.children.length).to.equal(0);
    expect(childNode.parent).to.equal(null);
  });

  describe('addChild', function() {
		it('new node successfully added to parent node', function() {
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
        bounds: bounds,
        tags: ['test'],
        rotation: 45
      };
      let parentNode = new SceneGraphNodeBase(params);
      let childNode = new SceneGraphNodeBase(params);
			expect(parentNode.children.length).to.equal(0);
			parentNode.addChild(childNode);
			
			expect(parentNode.children.length).to.equal(1);
			expect(parentNode.children[0]).to.equal(childNode);
			expect(childNode.parent).to.equal(parentNode);
		});

		it('child node successfully moved between parent nodes', function() {
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
        bounds: bounds,
        tags: ['test'],
        rotation: 45
      };
      let parentNode = new SceneGraphNodeBase(params);
      let childNode = new SceneGraphNodeBase(params);
			let secondParent = new SceneGraphNodeBase(params);
			parentNode.addChild(childNode);
			secondParent.addChild(childNode);
			expect(parentNode.children.length).to.equal(0);
			expect(secondParent.children.length).to.equal(1);
			expect(secondParent.children[0]).to.equal(childNode);
			expect(childNode.parent).to.equal(secondParent);
		});
	});
});

const parentChildGenerator =  function() {
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
