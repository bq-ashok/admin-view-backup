import Ember from 'ember';

/**
 * Serializer for activities endpoints
 *
 * @typedef {Object} ActivitiesSerializer
 */
export default Ember.Object.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service(),


  /**
   * Get search learning maps
   * @returns {Promise.<[]>}
   */
  normalizeLearningMaps: function(response) {
    if (response.contents) {
      response = Ember.Object.create(response.contents);
      Object.keys(response).forEach(key => {
        response.set(key, Ember.Object.create(response.get(key)));
      });
    }
    return response;
  }

});
