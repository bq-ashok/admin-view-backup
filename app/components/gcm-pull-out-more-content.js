import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gcm-pull-out-more-content'],

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * Search service to fetch content details
   */
  searchService: Ember.inject.service('api-sdk/search'),

  // -------------------------------------------------------------------------
  // Properties
  /**
   * User selected node data
   */
  nodeData: null,

  /**
   * User selected node data
   */
  prerequisites: null,

  /**
   * Search length for fetching search items
   */
  searchLength: 3,

  /**
   * List of resource contents
   */
  resourceContent: null,

  /**
   * List of collection contents
   */
  collectionContent: null,

  /*
   * List of assessment contents
   */
  assessmentContent: null,

  /*
   * List of question contents
   */
  questionContent: null,
  /*
   * List of course contents
   */
  courseContent: null,

  /*
   * List of unit contents
   */
  unitContent: null,

  /*
   * List of lesson contents
   */
  lessonContent: null
});
