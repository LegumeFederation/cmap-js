import { expect, assert } from 'chai';
import { Bounds } from '../src/util/Bounds';
import { SceneGraphNodeBase } from '../src/canvas/SceneGraphNodeBase';

describe('SceneGraphNode test', () => {

  it('constructor works', () => {
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
      tag: 'test',
      rotation: 45
    };
    let node = new SceneGraphNodeBase(params);
    expect(node.parent).to.equal(parent);
    expect(node.bounds).eql(bounds);
    expect(node.tag).to.equal('test');
    expect(node.rotation).to.equal(45);
  });

  it('get globalBounds', () => {
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

  it('translatePointToGlobal', () => {
    let parentNode = parentChildGenerator();
    let childNode = parentNode.children[0];
    let point = childNode.translatePointToGlobal({x: 3, y: 8});
    expect(point).eql({x: 10, y: 12});
  });

});

const parentChildGenerator = () => {
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
