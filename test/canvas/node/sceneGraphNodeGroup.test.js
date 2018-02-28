import {expect} from 'chai';
import {Bounds} from '../../../src/model/Bounds';
import {SceneGraphNodeGroup} from '../../../src/canvas/node/SceneGraphNodeGroup';

describe('SceneGraphNodeGroup test', function () {
  describe('constructor', function () {
    it('should create a new group', function () {
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
      let node = new SceneGraphNodeGroup(params);
      expect(node.parent).to.equal(parent);
      expect(node.bounds).eql(bounds);
      expect(node.tags).eql(['test']);
      expect(node.rotation).to.equal(45);
    });
  });
});
