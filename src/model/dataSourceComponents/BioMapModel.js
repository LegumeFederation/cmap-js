/**
 * BioMap data model
 */

export class BioMapModel {

  /**
   * create a BioMapModel
   * @param {Object} params having the following properties:
   * @param {String} name - the map name
   * @param {Object} source - the DataSourceModel where bioMap was loaded from
   * @param {Object} coordinates - object w/ start and stop props
   * @param {Array} features - an array of Feature instances.
   */

  constructor({
                name,
                source,
                features,
                tags,
                coordinates = {start: 0, stop: 0},
                config
              }) {
    this.name = name;
    this.source = source;
    this.features = features;
    this.tags = tags;
    this.coordinates = coordinates;
    this.config = config;
  }

  /**
   * getter for length (coordinates.stop - coordinates.start)
   * @returns {number}
   */

  get length() {
    return this.coordinates.stop - this.coordinates.start;
  }

  /**
   *
   * getter for unique name (prefix map name the id of data source)
   * @returns {string}
   */

  get uniqueName() {
    return `${this.source.id}/${this.name}`;
  }
}
