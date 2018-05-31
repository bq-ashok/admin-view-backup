import Ember from 'ember';
import {
  DEFAULT_IMAGES
} from 'admin-dataview/config/config';
/**
 * Serializer for User endpoints
 *
 * @typedef {Object} ProfileSerializer
 */
export default Ember.Object.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service(),

  /**
   * Normalized data of user  prefs content
   * @return {Object}
   */
  normalizeUserPrefsContent: function(response) {
    let resultSet = Ember.A();
    response = Ember.Object.create(response);
    Object.keys(response).forEach(key => {
      let count = response.get(key);
      let data = Ember.Object.create({
        name: key,
        value: count
      });
      resultSet.pushObject(data);
    });
    return resultSet;
  },

  /**
   * Normalized data of user profile
   * @return {Object}
   */
  normalizeUserProfile: function(response) {
    response = Ember.A(response);
    let thumbnail = response.get('thumbnail');
    let cdnUrls = this.get('session.cdnUrls');
    if (!thumbnail) {
      response.set('thumbnail', DEFAULT_IMAGES.USER_PROFILE);
    } else {
      response.set('thumbnail', cdnUrls.user + thumbnail);
    }
    let firstName = response.get('firstName');
    let lastName = response.get('lastName');
    let username = response.get('username');
    if (lastName && firstName) {
      response.set('userDisplayName', `${lastName  }  ${  firstName}`);
    } else if (lastName && !firstName) {
      response.set('userDisplayName', lastName);
    } else if (firstName && !lastName) {
      response.set('userDisplayName', firstName);
    } else if (username) {
      response.set('userDisplayName', username);
    }
    return response;
  },

  /**
   * Normalized data of user grades
   * @return {Object}
   */
  normalizeUserGrades: function(response) {
    let resultSet = Ember.A();
    response = Ember.A(response.grades);
    response.forEach(data => {
      let result = Ember.Object.create(data);
      resultSet.pushObject(result);
    });
    return resultSet;
  },

  /**
   * Normalized data of user prefs curators
   * @return {Object}
   */
  normalizeUserPrefsCurators: function(response) {
    let resultSet = Ember.A();
    response = Ember.A(response.curators);
    response.forEach(data => {
      let result = Ember.Object.create(data);
      resultSet.pushObject(result);
    });
    return resultSet;
  },

  /**
   * Normalized data of user prefs providers
   * @return {Object}
   */
  normalizeUserPrefsProviders: function(response) {
    let resultSet = Ember.A();
    response = Ember.A(response.providers);
    response.forEach(data => {
      let result = Ember.Object.create(data);
      resultSet.pushObject(result);
    });
    return resultSet;
  },


  /**
   * Normalized data of user profile read data
   * @return {Object}
   */
  normalizeReadUserProfile: function(response) {
    response = Ember.A(response.users[0]);
    let thumbnail = response.get('thumbnail');
    let cdnUrls = this.get('session.cdnUrls');
    if (!thumbnail) {
      response.set('thumbnail', DEFAULT_IMAGES.USER_PROFILE);
    } else {
      response.set('thumbnail', cdnUrls.user + thumbnail);
    }
    return response;
  }

});
