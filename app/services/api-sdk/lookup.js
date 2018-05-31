import Ember from 'ember';
import LookupSerializer from 'admin-dataview/serializers/lookup/lookup';
import LookupAdapter from 'admin-dataview/adapters/lookup/lookup';

/**
 * Service to support the Lookup entities
 *
 * Country, State, District
 *
 * @typedef {Object} LookupService
 */
export default Ember.Service.extend({
  lookupSerializer: null,

  lookupAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'lookupSerializer',
      LookupSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'lookupAdapter',
      LookupAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Gets the audience information
   * @returns {Promise.<Audience[]>}
   */
  readAudiences: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readAudiences().then(function(response) {
        resolve(
          service.get('lookupSerializer').normalizeReadAudiences(response)
        );
      }, reject);
    });
  },

  /**
   * Gets the depth of knowlege information
   * @returns {Promise.<DepthOfKnowledge[]>}
   */
  readDepthOfKnowledgeItems: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('lookupAdapter')
        .readDepthOfKnowledgeItems()
        .then(function(response) {
          resolve(
            service
              .get('lookupSerializer')
              .normalizeReadDepthOfKnowledgeItems(response)
          );
        }, reject);
    });
  },

  /**
   * Gets the license information
   * @returns {Promise.<License[]>}
   */
  readLicenses: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readLicenses().then(function(response) {
        resolve(
          service.get('lookupSerializer').normalizeReadLicenses(response)
        );
      }, reject);
    });
  },


  /**
   * Gets the license information
   * @returns {Promise.<21-century-skills[]>}
   */
  read21CenturySkills: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readCenturySkills().then(function(response) {
        resolve(
          service.get('lookupSerializer').normalizeCenturySkills(response)
        );
      }, reject);
    });
  }
});
