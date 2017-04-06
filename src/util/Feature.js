/**
 * Feature
 * A base class for biological map feature
 */
class Feature {

  /**
   * Create a Feature
   *
   * @param {Object} params - having the following properties
   * @param {String} name - name of feature
   * @param {Object} tags - array of String, optional slugs or tags
   * @param {Object} aliases - alternate names, optional
   * @returns {Object}
   */
  constructor({coordinates = { start: 0, end: 0}, name, tags=[], aliases=[]}) {
    this.coordinates = Object.freeze(coordinates); // object w/ start and end props
    this.name = name;
    this.tags = tags;
    this.aliases = aliases;
  }

  get length() {
    return this.coordinates.end - this.coordinates.start;
  }
}

/**
 * Find the common features based on name and aliases shared
 */

// FIXME: when the features are matched on aliases, the returned features
// do not show the variation in feature.names
const featuresInCommon = (features1, features2) => {
  const setupDict = (features) => {
    let dict = {};
    features.forEach( f => {
      dict[f.name] = f;
      f.aliases.forEach( a => {
        dict[a] = f;
      });
    });
    return dict;
  };
  let dict1 = setupDict(features1);
  let dict2 = setupDict(features2);
  let set1 = new Set(Object.keys(dict1));
  let set2 = new Set(Object.keys(dict2));
  let interection = new Set([...set1].filter(x => set2.has(x)));
  return Array.from(interection).map(key => dict1[key]);
};

export {Feature, featuresInCommon};
