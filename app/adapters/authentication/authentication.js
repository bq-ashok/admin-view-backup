import Ember from 'ember';

/**
 * Adapter for the Authentication (Login) with API 3.0
 *
 * @typedef {Object} AuthenticationAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus-auth/v2',

  /**
   * Post a request to authenticate a google user
   * @param access token required to build the get headers
   * @returns {Promise}
   */
  authenticationWithToken(data) {
    const url = `${this.get('namespace')}/token`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Authorization: `Token ${data.accessToken}`
      }
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders(data) {
    if (data.isAnonymous) {
      return {};
    } else {
      return {
        Authorization: `Basic ${btoa(`${data.username}:${data.password}`)}`
      };
    }
  }
});
