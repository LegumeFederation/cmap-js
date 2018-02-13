/**
 * concatAll() aka flattenDeep(), based on http://reactivex.io/learnrx/
 */
Array.prototype.concatAll = function () {
  var results = [];
  this.forEach(function (subArray) {
    results.push.apply(results, subArray);
  });
  return results;
};
