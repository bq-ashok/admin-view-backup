import Ember from 'ember';

/**
 * Adapter to support the operation for crosswalkAdapter
 *
 * @typedef {Object} crosswalkAdapter
 */

export default Ember.Object.extend({
  namespace: 'stubs/crosswalk',

  /**
   * @param subjectId
   * Method to fetch crosswalk data using JSON file
   */
  getCrosswalkData(subjectId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${subjectId}.json`;
    const options = {
      type: 'GET'
    };
    return Ember.RSVP.hashSettled({
      crosswalkData: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.crosswalkData.value;
    });
  }
});
