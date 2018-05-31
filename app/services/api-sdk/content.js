import Ember from 'ember';
import contentAdapter from 'admin-dataview/adapters/content/content';
import contentSerializer from 'admin-dataview/serializers/content/content';
/**
 * Service for the contents
 *
 * @typedef {Object} contentService
 */
export default Ember.Service.extend({
  learnersAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'contentAdapter',
      contentAdapter.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'contentSerializer',
      contentSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Fetch the content resource info by id
   * @returns {Object}
   */
  getResourceById: function(resourceId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getResourceById(resourceId)
        .then(function(response) {
          resolve(
            service.get('contentSerializer').normalizeResourceContent(response)
          );
        }, reject);
    });
  },

  /**
   * Fetch the collection content info by id
   * @returns {Object}
   */
  getCollectionById: function(collectionId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getCollectionById(collectionId)
        .then(function(response) {
          resolve(
            service
              .get('contentSerializer')
              .normalizeCollectionContent(response)
          );
        }, reject);
    });
  },

  /**
   * Fetch the content question info by id
   * @returns {Object}
   */
  getQuestionById: function(questionId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getQuestionById(questionId)
        .then(function(response) {
          resolve(
            service.get('contentSerializer').normalizeQuestionContent(response)
          );
        }, reject);
    });
  },

  /**
   * Fetch the assessment content info by id
   * @returns {Object}
   */
  getAssessmentById: function(assessmentId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getAssessmentById(assessmentId)
        .then(function(response) {
          resolve(
            service
              .get('contentSerializer')
              .normalizeAssessmentContent(response)
          );
        }, reject);
    });
  },

  /**
   * Fetch the course content info by id
   * @returns {Object}
   */
  getCourseById: function(courseId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getCourseById(courseId)
        .then(function(response) {
          resolve(
            service.get('contentSerializer').normalizeCourseContent(response)
          );
        }, reject);
    });
  },

  getLessonByUnitId: function(courseId, unitId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getLessonByUnitId(courseId, unitId)
        .then(function(response) {
          resolve(
            service.get('contentSerializer').normalizeLessonSummary(response)
          );
        }, reject);
    });
  },

  getCollectionByLessonId: function(courseId, unitId, lessonId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getCollectionByLessonId(courseId, unitId, lessonId)
        .then(function(response) {
          resolve(
            service
              .get('contentSerializer')
              .normalizeCollectionSummary(response)
          );
        }, reject);
    });
  },

  /**
   * Fetch the meta-data
   * @returns {Object}
   */
  getMetadataLevel: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('contentAdapter')
        .getMetadataLevel()
        .then(function(response) {
          resolve(
            service.get('contentSerializer').normalizeMetadataLevel(response)
          );
        }, reject);
    });
  }
});
