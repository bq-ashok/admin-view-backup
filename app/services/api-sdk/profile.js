import Ember from 'ember';
import ProfileSerializer from 'admin-dataview/serializers/profile/profile';
import ProfileAdapter from 'admin-dataview/adapters/profile/profile';

/**
 * Service to support the Profile
 *
 * @typedef {Object} ProfileService
 */
export default Ember.Service.extend({

  /**
   * profile Serializer
   * @type {Object}
   */
  profileSerializer: null,

  /**
   * profile Adapter
   * @type {Object}
   */
  profileAdapter: null,

  /**
   * Intialize profile serializer  and adapter
   */
  init: function() {
    this._super(...arguments);
    this.set(
      'profileSerializer',
      ProfileSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'profileAdapter',
      ProfileAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Fetch the User Profile
   * @returns {Object}
   */
  getUserProfile: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .getUserProfile(userId)
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeUserProfile(response));
        }, reject);
    });
  },


  /**
   * Fetch the User Grades
   * @returns {Object}
   */
  getUserGrades: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .getUserGrades(userId)
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeUserGrades(response));
        }, reject);
    });
  },

  /**
   * Fetch the User Prefs content
   * @returns {Object}
   */
  getUserPrefsContent: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .getUserPrefsContent(userId)
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeUserPrefsContent(response));
        }, reject);
    });
  },

  /**
   * Fetch the User Prefs curators
   * @returns {Object}
   */
  getUserPrefsCurators: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .getUserPrefsCurators(userId)
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeUserPrefsCurators(response));
        }, reject);
    });
  },

  /**
   * Fetch the User Prefs providers
   * @returns {Object}
   */
  getUserPrefsProviders: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .getUserPrefsProviders(userId)
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeUserPrefsProviders(response));
        }, reject);
    });
  },


  /**
   * Fetch the User Profile from serach FE..
   * @returns {Object}
   */
  readUserProfile: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('profileAdapter')
        .readUserProfile(userId)
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeReadUserProfile(response));
        }, reject);
    });
  }

});
