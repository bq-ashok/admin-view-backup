import Ember from 'ember';

/**
 * Adapter to support the Learner API's
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/ds/users',

  /**
   * Get learners profile distribution
   * @returns {Promise.<[]>}
   */
  getLearnerProfileDistribution(subjectId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/distribution`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { subjectId: subjectId, zoom: 1, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      locationBasedCount: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.locationBasedCount.value;
    });
  },

  /**
   * Get user stats content count
   * @returns {Promise.<[]>}
   */
  getUserStatsContent(userId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/stats/contents`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { user: userId, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      userStatsContent: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userStatsContent.value;
    });
  },

  /**
   * Get user stats content count
   * @returns {Promise.<[]>}
   */
  getUserStatsContentByType(userId, contentType, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/stats/resources`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user: userId,
        contentType: contentType,
        activeDuration: activeDuration
      }
    };
    return Ember.RSVP.hashSettled({
      userStatsContent: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userStatsContent.value;
    });
  },

  /**
   * Get user stats by courses
   * @returns {Promise.<[]>}
   */
  getUserStatsByCourse(userId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/stats/courses`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { user: userId, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      userStatsByCourse: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userStatsByCourse.value;
    });
  },

  /**
   * Get user  journey stats
   * @returns {Promise.<[]>}
   */
  getUserJourneyStats(userId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/stats/journeys`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { user: userId, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      userJourneyStats: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userJourneyStats.value;
    });
  },

  /**
   * Get user  competency  stats
   * @returns {Promise.<[]>}
   */
  getUserCompetencyStats(userId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/stats/competency`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { user: userId, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      userCompetencyStats: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userCompetencyStats.value;
    });
  },

  /**
   * Get active user distribution by subject
   * @returns {Promise.<[]>}
   */
  getActiveUserDistrbutionBySubject(subjectId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/distribution/active`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { subject: subjectId, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      activeUserDistrbutionBySubject: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.activeUserDistrbutionBySubject.value;
    });
  },

  /**
   * Get user stats content count
   * @returns {Promise.<[]>}
   */
  getUserTimeSpentStats(userId, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/stats/timespent`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: { user: userId, activeDuration: activeDuration }
    };
    return Ember.RSVP.hashSettled({
      userTimeSpentStats: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userTimeSpentStats.value;
    });
  },

  /**
   * Get learner User profiles
   * @returns {Promise.<[]>}
   */
  getLearnerUserProfiles() {
    const adapter = this;
    const namespace = 'stubs';
    const url = `${namespace}/learners/user-profiles.json`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8'
    };
    return Ember.RSVP.hashSettled({
      learnerProfiles: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.learnerProfiles.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
