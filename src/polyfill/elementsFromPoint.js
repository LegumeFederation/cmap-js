/**
 * returns a list of all elements under the cursor
 * from https://gist.github.com/iddan/54d5d9e58311b0495a91bf06de661380
 *
 * It appears Safari and maybe Opera browsers are missing this;
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint
 */
'use strict';

if (!document.elementsFromPoint) {
  document.elementsFromPoint = elementsFromPoint;
}

/* istanbul ignore next: depends on browser native elementFromPoint(x,y) */
function elementsFromPoint(x, y) {
  var parents = [];
  var parent = void 0;
  do {
    if (parent !== document.elementFromPoint(x, y)) {
      parent = document.elementFromPoint(x, y);
      parents.push(parent);
      parent.style.pointerEvents = 'none';
    } else {
      parent = false;
    }
  } while (parent);
  parents.forEach(function (parent) {
    return parent.style.pointerEvents = 'all';
  });
  return parents;
}
