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
   * @param {Object} tags - array of String, optional slugs or tags, optional
   * @param {Object} aliases - array of alternate names, optional
   * @returns {Object}
   */
  constructor({
    coordinates = { start: 0, stop: 0},
    name,
    tags=[],
    aliases=[],
  }) {
    this.coordinates = Object.freeze(coordinates); // object w/ start and end props
    this.name = name;
    this.tags = tags;
    this.aliases = aliases;
  }

  get length() {
    return this.coordinates.stop - this.coordinates.start;
  }
}

/**
 * Find the common features based on name and aliases.
 */

// FIXME: when the features are matched on aliases, the returned features
// do not show the variation in feature.names.
// FIXME: support more than two collections of features
const featuresInCommon = (features1, features2) => {
  const setupDict = (features) => {
    let dict = {};
    features.forEach( f => {
      dict[f.name] = f;
      f.aliases.forEach( a => {
        if(a) dict[a] = f;
      });
    });
    return dict;
  };
  let dict1 = setupDict(features1);
  let dict2 = setupDict(features2);
  let intersectedKeys = Object.keys(dict1).filter( key => dict2[key] );
  return intersectedKeys.map( key => dict1[key] );
};

export {Feature, featuresInCommon};
