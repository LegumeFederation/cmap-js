/**
 * @description concatAll() aka flattenDeep(), based on http://reactivex.io/learnrx/
 * @return {array} concatenated array.
 */

Array.prototype.concatAll = function () {
  let results = [];
  this.forEach(function (subArray) {
    results.push.apply(results, subArray);
  });
  return results;
};
