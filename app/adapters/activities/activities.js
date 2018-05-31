import Ember from 'ember';

/**
 * Adapter to support activities API
 *
 * @typedef {Object} activitiesAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/gooru-search/rest',

  /**
   * Get search learning maps
   * @returns {Promise.<[]>}
   */
  getLearningMaps(filters = {}, q = '*', length = 0) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/pedagogy-search/learning-maps`;
    let requestParams = { q: q, length: length };
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    };
    options.data = Object.assign(requestParams, filters);
    return Ember.RSVP.hashSettled({
      learningMaps: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.learningMaps.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
