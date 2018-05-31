import Ember from 'ember';
import JourneyAdapter from 'admin-dataview/adapters/journey/journey';
import JourneySerializer from 'admin-dataview/serializers/journey/journey';
/**
 * Service for the journey
 *
 * @typedef {Object} journeyService
 */
export default Ember.Service.extend({

  journeyAdapter: null,

  journeySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set('journeyAdapter', JourneyAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('journeySerializer', JourneySerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Get journey of user taken (courses and IL's courses)
   * @returns {Promise.<[]>}
   */
  getUserJourneyByCourses: function(userId, requestPayLoad) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('journeyAdapter')
        .getUserJourneyByCourses(userId, requestPayLoad)
        .then(function(response) {
          resolve(service.get('journeySerializer').normalizeUserJourneyByCourses(response));
        }, reject);
    });
  }

});
