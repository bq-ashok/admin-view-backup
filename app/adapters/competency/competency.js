import Ember from 'ember';

/**
 * Adapter to support the Competency API
 *
 * @typedef {Object} CompetencyAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/ds/users',

  /**
   * Get user  competencies
   * @returns {Promise.<[]>}
   */
  getUserCompetencies(user, activeDuration = '3m') {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/competency`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user,
        activeDuration
      }
    };
    return Ember.RSVP.hashSettled({
      userCompetencies: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userCompetencies.value;
    });
  },

  /**
   * Get user performance competency collections
   * @returns {Promise.<[]>}
   */
  getUserPerformanceCompetencyCollections(user, competencyCode) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/performance/competency/collections`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user,
        competencyCode
      }
    };
    return Ember.RSVP.hashSettled({
      userPerformanceCompetencyCollections: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPerformanceCompetencyCollections.value;
    });
  },

  /**
   * Get Competency Matrix Coordinates for Subject
   * @returns {Promise.<[]>}
   */
  getCompetencyMatrixCoordinates(subject) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/tx/competency/matrix/coordinates`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        subject
      }
    };
    return Ember.RSVP.hashSettled({
      competencyMatrixCoordinates: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.competencyMatrixCoordinates.value;
    });
  },

  /**
   * Get user competency Matrix for courses by subject
   * @returns {Promise.<[]>}
   */
  getCompetencyMatrixCourse(user, subject) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/tx/competency/matrix/course`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user,
        subject
      }
    };
    return Ember.RSVP.hashSettled({
      competencyMatrixCourse: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.competencyMatrixCourse.value;
    });
  },

  /**
   * Get user competency Matrix for domains by subjects
   * @returns {Promise.<[]>}
   */
  getCompetencyMatrixDomain(user, subject) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/tx/competency/matrix/domain`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user,
        subject
      }
    };
    return Ember.RSVP.hashSettled({
      competencyMatrix: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.competencyMatrix.value;
    });
  },

  /**
   * Get user competency Matrix  by subjects
   * @returns {Promise.<[]>}
   */
  getCompetencyMatrix(user, subject) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/tx/competency/matrix`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        user,
        subject
      }
    };
    return Ember.RSVP.hashSettled({
      competencyMatrix: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.competencyMatrix.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
