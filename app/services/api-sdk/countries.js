import Ember from 'ember';
import CountriesAdapter from 'admin-dataview/adapters/countries/countries';

/**
 * Service for the countries
 *
 * @typedef {Object} countriesService
 */
export default Ember.Service.extend({

  countriesAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set('countriesAdapter', CountriesAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Fetch the countries data
   * @returns {Object}
   */
  getCountries: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('countriesAdapter')
        .getCountries()
        .then(function(response) {
          resolve(Ember.Object.create(response));
        }, reject);
    });
  },

  /**
   * Fetch the countries region data
   * @returns {Object}
   */
  getCountriesRegion: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('countriesAdapter')
        .getCountriesRegion()
        .then(function(response) {
          let result = Ember.A();
          response.forEach(data => {
            result.pushObject(Ember.Object.create(data));
          });
          resolve(result);
        }, reject);
    });
  }

});
