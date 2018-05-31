import Ember from 'ember';

/**
 * Adapter to support the Performance API
 *
 * @typedef {Object} PerformanceAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/ds/users',

  /**
   * Get performance of user performance units
   * @returns {Promise.<[]>}
   */
  getUserPerformanceUnits(user, courseId, classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/performance/course`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        courseId,
        user
      }
    };
    if (classId) {
      options.data.classId = classId;
    }
    return Ember.RSVP.hashSettled({
      userPerformanceUnits: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPerformanceUnits.value;
    });
  },

  /**
   * Get performance of user performance lessons
   * @returns {Promise.<[]>}
   */
  getUserPerformanceLessons(user, courseId, unitId, classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/performance/lessons`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        courseId,
        unitId,
        user
      }
    };
    if (classId) {
      options.data.classId = classId;
    }
    return Ember.RSVP.hashSettled({
      userPerformanceLessons: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPerformanceLessons.value;
    });
  },

  /**
   * Get performance of user performance collections
   * @returns {Promise.<[]>}
   */
  getUserPerformanceCollections(user, courseId, unitId, lessonId, classId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/performance/collections`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        courseId,
        unitId,
        lessonId,
        user
      }
    };
    if (classId) {
      options.data.classId = classId;
    }
    return Ember.RSVP.hashSettled({
      userPerformanceCollections: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userPerformanceCollections.value;
    });
  },

  /**
   * Get performance of user  resource in assessments
   * @returns {Promise.<[]>}
   */
  getUserPerformanceResourceInAssessment(
    user,
    courseId,
    unitId,
    lessonId,
    assessmentId,
    sessionId,
    classId
  ) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/summary/assessment`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        assessmentId,
        user,
        sessionId
      }
    };
    if (classId) {
      options.data.classId = classId;
    }
    if (courseId) {
      options.data.courseId = courseId;
    }
    if (unitId) {
      options.data.unitId = unitId;
    }
    if (lessonId) {
      options.data.lessonId = lessonId;
    }
    return Ember.RSVP.hashSettled({
      userResourceInAssessment: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userResourceInAssessment.value;
    });
  },

  /**
   * Get performance of user  resource in collection
   * @returns {Promise.<[]>}
   */
  getUserPerformanceResourceInCollection(
    user,
    courseId,
    unitId,
    lessonId,
    collectionId,
    sessionId,
    classId
  ) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/v1/user/summary/collection`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders(),
      contentType: 'application/json; charset=utf-8',
      data: {
        collectionId,
        user,
        sessionId
      }
    };
    if (classId) {
      options.data.classId = classId;
    }
    if (courseId) {
      options.data.courseId = courseId;
    }
    if (unitId) {
      options.data.unitId = unitId;
    }
    if (lessonId) {
      options.data.lessonId = lessonId;
    }
    return Ember.RSVP.hashSettled({
      userResourceInCollection: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.userResourceInCollection.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
