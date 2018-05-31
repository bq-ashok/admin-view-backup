import Ember from 'ember';

/**
 * Adapter to support user profile, grades and prefs
 *
 * @typedef {Object} ProfileAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/ds/users',

  namespaceProfile: '/api/nucleus/v2/profiles',

  /**
   * Get User profile
   * @returns {Promise.<[]>}
   */
  getUserProfile(userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/profile`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user: userId
      }
    };
    return Ember.RSVP.hashSettled({
      userProfile: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userProfile.value;
    });
  },

  /**
   * Get User grades
   * @returns {Promise.<[]>}
   */
  getUserGrades(userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/grades`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user: userId
      }
    };
    return Ember.RSVP.hashSettled({
      userGrades: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userGrades.value;
    });
  },

  /**
   * Get user prefs content
   * @returns {Promise.<[]>}
   */
  getUserPrefsContent(userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/prefs/content`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user: userId
      }
    };
    return Ember.RSVP.hashSettled({
      userPrefsContent: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPrefsContent.value;
    });
  },

  /**
   * Get user prefs providers
   * @returns {Promise.<[]>}
   */
  getUserPrefsProviders(userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/prefs/providers`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user: userId
      }
    };
    return Ember.RSVP.hashSettled({
      userPrefsProviders: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPrefsProviders.value;
    });
  },

  /**
   * Get user prefs curators
   * @returns {Promise.<[]>}
   */
  getUserPrefsCurators(userId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/prefs/curators`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user: userId
      }
    };
    return Ember.RSVP.hashSettled({
      userPrefsCurators: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPrefsCurators.value;
    });
  },

  /**
   * Get User profile
   * @returns {Promise.<[]>}
   */
  readUserProfile(userId) {
    const adapter = this;
    const namespace = adapter.get('namespaceProfile');
    const url = `${namespace}/search`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        userids: userId
      }
    };
    return Ember.RSVP.hashSettled({
      userProfile: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userProfile.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
