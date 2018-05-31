import Ember from 'ember';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: 'config',

  /**
   * Gets custom configuration
   * @returns {Promise.<[]>}
   */
  loadConfiguration(key) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/${key}.json`;
    const options = {
      type: 'GET'
    };
    return Ember.RSVP.hashSettled({
      configuration: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.configuration.value;
    });
  }
});
