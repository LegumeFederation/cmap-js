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
    source,
    coordinates = { start: 0, stop: 0},
    name,
    tags=[],
    aliases=[],
  }) {
    this.source = source;
    this.coordinates = Object.freeze(coordinates); // object w/ start and end props
    this.name = name;
    this.tags = tags;
    this.aliases = aliases;
  }

  get length() {
    return this.coordinates.stop - this.coordinates.start;
  }

  get typeHasLinkouts() {
    return this.source.linkouts.some(l => {
          return this.typeLinkedBy(l);
        });
  }

  typeLinkedBy(linkout) {
    return linkout.featuretypePattern != undefined ? 
    this.tags.some(t => {return linkout.featuretypePattern.test(t);}) 
    : this.tags.includes(linkout.featuretype);
  }
}

/**
 * Find the common features based on name and aliases.
 * @param Array features1 - 1st collection of features
 * @param Array features2 - 2nd collection of features
 * @return Array - tuples of results in common [[feat1, feat2], ...]
 */
// TODO: support more than two collections of features
function featuresInCommon(features1, features2) {
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
  return intersectedKeys.map( key => {
    return [ dict1[key], dict2[key] ];
  });
}


export {Feature, featuresInCommon};
