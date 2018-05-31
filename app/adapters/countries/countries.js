import Ember from 'ember';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  namespace: 'stubs',

  /**
   * Get countries data
   * @returns {Promise.<[]>}
   */
  getCountries() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/countries.json`;
    const options = {
      type: 'GET'
    };
    return Ember.RSVP.hashSettled({
      countries: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.countries.value;
    });
  },

  /**
   * Get countries region data
   * @returns {Promise.<[]>}
   */
  getCountriesRegion() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/countries-region.json`;
    const options = {
      type: 'GET'
    };
    return Ember.RSVP.hashSettled({
      countriesRegion: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.countriesRegion.value;
    });
  }
});
