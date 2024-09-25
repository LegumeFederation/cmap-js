import o from "ospec";
import mq from "mithril-query";
import { CMAP } from '../../src/ui/CMAP.js';

o.spec('CMAP class', function () {
  o('constructor works', function () {
    let cmap = new CMAP();
    o(!!cmap).equals(true);
  });
});
