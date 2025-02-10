import o from 'ospec';
import { Bounds } from '../../../src/model/Bounds.js';
import { SceneGraphNodeTrack } from '../../../src/canvas/node/SceneGraphNodeTrack.js';

o.spec('SceneGraphNodeTrack test', function () {
  o('constructor works', function () {
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
    let node = new SceneGraphNodeTrack(params);
    o(node.parent).equals(parent);
    o(node.bounds).deepEquals(bounds);
    o(node.tags).deepEquals(['test']);
    o(node.rotation).equals(45);
  });
});
