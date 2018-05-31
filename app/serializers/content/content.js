import Ember from 'ember';
import TaxonomySerializer from 'admin-dataview/serializers/taxonomy/taxonomy';
import { DEFAULT_IMAGES } from 'admin-dataview/config/config';

/**
 * Serializer for activities endpoints
 *
 * @typedef {Object} contentSerializers
 */
export default Ember.Object.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @type {SessionService} Service to retrieve session information
   */
  session: Ember.inject.service(),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalized data of resource by id
   * @return {Object}
   */
  normalizeResourceContent: function(response) {
    response = Ember.A(response);
    let thumbnail = response.get('thumbnail');
    let cdnUrls = this.get('session.cdnUrls');
    if (!thumbnail) {
      response.set('thumbnail', DEFAULT_IMAGES.USER_PROFILE);
    } else {
      response.set('thumbnail', cdnUrls.user + thumbnail);
    }
    const serializer = this;
    let taxonomy = serializer
      .get('taxonomySerializer')
      .normalizeTaxonomyObject(response.taxonomy);
    response.taxonomy = taxonomy[0];
    return response;
  },

  /**
   * Normalized data of collection by id
   * @return {Object}
   */
  normalizeCollectionContent: function(collectionData) {
    return collectionData ? collectionData : {};
  },

  /**
   * Normalized data of assessment by id
   * @return {Object}
   */
  normalizeAssessmentContent: function(assessmentData) {
    return assessmentData ? assessmentData : {};
  },

  /**
   * Normalized data of course by id
   * @return {Object}
   */
  normalizeCourseContent: function(courseData) {
    const serializer = this;
    let serializedCourseData = courseData;
    let taxonomy = serializer
      .get('taxonomySerializer')
      .normalizeTaxonomyObject(courseData.taxonomy);
    serializedCourseData.taxonomy = taxonomy;
    let aggregatedTaxonomy = serializer.get('taxonomySerializer').normalizeLearningMapsTaxonomyArray(courseData.aggregated_taxonomy);
    serializedCourseData.aggregated_taxonomy = aggregatedTaxonomy;
    return serializedCourseData;
  },

  /**
   * Normalized data of resource by id
   * @return {Object}
   */
  normalizeQuestionContent: function(response) {
    response = Ember.A(response);
    const serializer = this;
    let taxonomy = serializer
      .get('taxonomySerializer')
      .normalizeTaxonomyObject(response.taxonomy);
    response.taxonomy = taxonomy[0];
    return response;
  },

  normalizeLessonSummary: function(lessonData) {
    let serializedLessonData = Ember.A();
    if (lessonData) {
      serializedLessonData = {
        lessonSummary: lessonData.lesson_summary,
        title: lessonData.title
      };
    }
    return serializedLessonData;
  },

  normalizeCollectionSummary: function(collectionData) {
    let serializedCollectionData = Ember.A();
    if (collectionData) {
      return (serializedCollectionData = {
        collectionSummary: collectionData.collection_summary
      });
    }
    return serializedCollectionData;
  },

  /**
   * normalizeMetadataLevel
   * @return {Object}
   */
  normalizeMetadataLevel: function(metadata) {
    return metadata ? metadata : {};
  }
});
