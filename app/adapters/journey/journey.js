import Ember from 'ember';

/**
 * Adapter to support the Journey API
 *
 * @typedef {Object} JourneyAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/ds/users',

  /**
   * Get journey of user taken (courses and IL's courses)
   * @returns {Promise.<[]>}
   */
  getUserJourneyByCourses(userId, requestPayLoad) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/journey?user=${userId}`;
    const options = {
      type: 'POST',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(requestPayLoad)
    };
    return Ember.RSVP.hashSettled({
      userJourneyByCourses: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userJourneyByCourses.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
