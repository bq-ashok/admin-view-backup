import Ember from 'ember';
import {DEFAULT_IMAGES} from 'admin-dataview/config/config';

/**
 * Serializer for journey endpoints
 *
 * @typedef {Object} PerformanceSerializer
 */
export default Ember.Object.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service(),


  /**
   * Get journey of user taken (courses and IL's courses)
   * @returns {Promise.<[]>}
   */
  normalizeUserJourneyByCourses: function(response) {
    let resultSet = Ember.A();
    let cdnUrls = this.get('session.cdnUrls');
    response = Ember.A(response.journeys);
    response.forEach(data => {
      let result = Ember.Object.create(data);
      let thumbnail = result.get('thumbnail');
      if(!thumbnail) {
        result.set('thumbnail', DEFAULT_IMAGES.COURSE);
      } else {
        result.set('thumbnail', cdnUrls.content + thumbnail);
      }
      resultSet.pushObject(result);
    });
    return resultSet;
  }

});
