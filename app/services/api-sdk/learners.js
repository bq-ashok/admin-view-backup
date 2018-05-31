import Ember from 'ember';
import LearnersAdapter from 'admin-dataview/adapters/learners/learners';
import LearnersSerializer from 'admin-dataview/serializers/learners/learners';
/**
 * Service for the learners
 *
 * @typedef {Object} learnersService
 */
export default Ember.Service.extend({

  learnersAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set('learnersAdapter', LearnersAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('learnersSerializer', LearnersSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Fetch the learners profile distribution
   * @returns {Object}
   */
  getLearnerProfileDistribution: function(subjectId = null) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getLearnerProfileDistribution(subjectId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeLearnerProfileDistribution(response));
        }, reject);
    });
  },

  /**
   * Get user stats content count
   * @returns {Promise.<[]>}
   */
  getUserStatsContent: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getUserStatsContent(userId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeUserStats(response));
        }, reject);
    });
  },

  /**
   * Get user stats content count
   * @returns {Promise.<[]>}
   */
  getUserStatsContentByType: function(userId, contentType) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getUserStatsContentByType(userId, contentType)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeUserStatsContentByType(response));
        }, reject);
    });
  },

  /**
   * Get user stats by courses
   * @returns {Promise.<[]>}
   */
  getUserStatsByCourse: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getUserStatsByCourse(userId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeUserStatsBycourse(response));
        }, reject);
    });
  },

  /**
   * Get user  journey stats
   * @returns {Promise.<[]>}
   */
  getUserJourneyStats: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getUserJourneyStats(userId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeUserStats(response));
        }, reject);
    });
  },

  /**
   * Get user  competency  stats
   * @returns {Promise.<[]>}
   */
  getUserCompetencyStats: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getUserCompetencyStats(userId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeUserStats(response));
        }, reject);
    });
  },


  /**
   * Get active user distribution by subject
   * @returns {Promise.<[]>}
   */
  getActiveUserDistrbutionBySubject: function(subjectId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getActiveUserDistrbutionBySubject(subjectId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeActiveUserDistrbutionBySubject(response));
        }, reject);
    });
  },

  /**
   * Get user stats timespent stats
   * @returns {Promise.<[]>}
   */
  getUserTimeSpentStats: function(userId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getUserTimeSpentStats(userId)
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeUserStats(response));
        }, reject);
    });
  },

  /**
   * Get learner user profiles
   * @returns {Promise.<[]>}
   */
  getLearnerUserProfiles: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('learnersAdapter')
        .getLearnerUserProfiles()
        .then(function(response) {
          resolve(service.get('learnersSerializer').normalizeLearnerUserProfiles(response));
        }, reject);
    });
  }

});
