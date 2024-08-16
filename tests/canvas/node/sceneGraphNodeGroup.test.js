import o from "ospec";
import mq from 'mithril-query';
import { Bounds } from '../../../src/model/Bounds.js';
import { SceneGraphNodeGroup } from '../../../src/canvas/node/SceneGraphNodeGroup.js';

o.spec('SceneGraphNodeGroup test', function () {
  o.spec('constructor', function () {
    o('should create a new group', function () {
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
      o(node.parent).equals(parent);
      o(node.bounds).deepEquals(bounds);
      o(node.tags).deepEquals(['test']);
      o(node.rotation).equals(45);
    });
  });
});
