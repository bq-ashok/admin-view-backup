import Ember from 'ember';

/**
 * Adapter to support the content get  API's
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1',

  namespaceStubs: 'stubs',

  /**
   * Reads a resource by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  getResourceById(resourceId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const resource = 'resources';
    const url = `${namespace}/${resource}/${resourceId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.RSVP.hashSettled({
      locationBasedCount: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.locationBasedCount.value;
    });
  },

  /**
   * Reads a collection by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  getCollectionById(collectionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const resource = 'collections';
    const url = `${namespace}/${resource}/${collectionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Reads a assessment by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  getAssessmentById(assessmentId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/assessments/${assessmentId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Reads a resource by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  getQuestionById(questionId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const question = 'questions';
    const url = `${namespace}/${question}/${questionId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Reads a course by id
   *
   * @param {string} resourceId
   * @returns {Promise}
   */
  getCourseById(courseId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const course = 'courses';
    const url = `${namespace}/${course}/${courseId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.RSVP.hashSettled({
      courseContent: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.courseContent.value;
    });
  },

  getLessonByUnitId(courseId, unitId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/courses/${courseId}/units/${unitId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.RSVP.hashSettled({
      lessons: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.lessons.value;
    });
  },

  getCollectionByLessonId(courseId, unitId, lessonId) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/courses/${courseId}/units/${unitId}/lessons/${lessonId}`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders()
    };
    return Ember.RSVP.hashSettled({
      collections: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.collections.value;
    });
  },

  /**
   * Reads a getMetadataLevel
   *
   * @returns {Promise}
   */
  getMetadataLevel() {
    const adapter = this;
    const namespaceStubs = adapter.get('namespaceStubs');
    const url = `${namespaceStubs}/meta-data.json`;
    const options = {
      type: 'GET'
    };
    return Ember.RSVP.hashSettled({
      metadataLevel: Ember.$.ajax(url, options)
    }).then(function(hash) {
      return hash.metadataLevel.value;
    });
  },

  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
