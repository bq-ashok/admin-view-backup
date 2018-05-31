import Ember from 'ember';
import ActivitiesAdapter from 'admin-dataview/adapters/activities/activities';
import ActivitiesSerializer from 'admin-dataview/serializers/activities/activities';
/**
 * Service for the activities
 *
 * @typedef {Object} activitiesService
 */
export default Ember.Service.extend({

  activitiesAdapter: null,

  activitiesSerializer: null,

  init: function() {
    this._super(...arguments);
    this.set('activitiesAdapter', ActivitiesAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('activitiesSerializer', ActivitiesSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Get search learning maps
   * @returns {Promise.<[]>}
   */
  getLearningMaps: function(filters, q, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('activitiesAdapter')
        .getLearningMaps(filters, q, length)
        .then(function(response) {
          resolve(service.get('activitiesSerializer').normalizeLearningMaps(response));
        }, reject);
    });
  }

});
