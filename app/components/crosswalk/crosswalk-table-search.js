import Ember from 'ember';
import Utils from 'admin-dataview/utils/taxonomy';
import { CONTENT_TYPES } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  //-------------------------------------------------------------------------
  //Attributes
  classNames: ['crosswalk-table-search'],

  //-------------------------------------------------------------------------
  //Service
  /**
   * @requires service:search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * List of matching crosswalk codes
   */
  matchingCrosswalkCodes: null,

  /**
   * Type wise content count list
   */
  contentCountData: null,

  /**
   * Signature contents
   */
  signatureContents: null,

  /**
   * Selected standard description
   */
  description: '',

  /**
   * Show/Hide loading
   */
  isLoading: false,

  /**
   * Show/Hide selected standard info
   */
  isShowStandardInfo: false,

  /**
   * Is crosswalk available or not
   */
  isCrosswalkAvailable: true,

  /**
   * Is crosswalk content not available
   */
  isContentNotAvailable: false,

  //-------------------------------------------------------------------------
  //Actions
  actions: {
    /**
     * OnFocusOut action triggered when the user type on the search box
     */
    onSearchCrosswalk(searchInput) {
      let component = this;
      let crosswalkCodes = component.get('crosswalkCodes');
      let matchingCrosswalkCodes = [];
      crosswalkCodes.some(function(crosswalkCode) {
        if (component.getMatchingCrosswalkCodes(crosswalkCode, searchInput)) {
          matchingCrosswalkCodes.push(crosswalkCode);
        }
        return matchingCrosswalkCodes.length === 3;
      });
      component.set('isCrosswalkAvailable', matchingCrosswalkCodes.length > 0);
      component.set('matchingCrosswalkCodes', matchingCrosswalkCodes);
    },

    /**
     * Action triggered when the user click on the back icon
     */
    onBackToCrosswalk() {
      let component = this;
      component.sendAction('onBackToCrosswalk');
    },

    /**
     * Action triggered when the user select a standard
     */
    onSelectCrosswalk(crosswalkCode, cardIndex) {
      let component = this;
      component.$('.crosswalk-card').removeClass('active');
      component.$(`.card-${cardIndex}`).addClass('active');
      component.fetchLearningMapContentByStandardId(crosswalkCode);
    }
  },

  //-------------------------------------------------------------------------
  //Methods

  /**
   * @function getMatchingCrosswalkCodes
   * function to return matching crosswalk codes by user preference
   */
  getMatchingCrosswalkCodes(crosswalkCode, searchInput) {
    let searchPattern = new RegExp(searchInput, 'i');
    return (
      searchPattern.test(crosswalkCode.id) ||
      searchPattern.test(crosswalkCode.title)
    );
  },

  /**
   * @function fetchLearningMapContentByStandardId
   * Fetch Learning Map content by using selected standard code
   */
  fetchLearningMapContentByStandardId(crosswalkCode) {
    let component = this;
    let frameworkId = component.get('selectedFramework');
    let length = 3;
    component.set('isLoading', true);
    if (frameworkId !== 'COMPETENCY') {
      ///not GUT code
      crosswalkCode.fwCode = frameworkId;
    }
    let learningMapContentPromise = Ember.RSVP.resolve(
      component.get('searchService').learningMapsContent(crosswalkCode, length)
    );
    return Ember.RSVP.hash({
      learningMapsContent: learningMapContentPromise
    }).then(function(hash) {
      component.set(
        'contentCountData',
        component.getContentCountData(hash.learningMapsContent.contents)
      );
      component.set(
        'signatureContents',
        hash.learningMapsContent.signatureContents
      );
      component.set('prerequisites', hash.learningMapsContent.prerequisites);
      component.set('description', hash.learningMapsContent.title);
      component.set('GUT', hash.learningMapsContent.gutCode);
      component.set('isShowStandardInfo', true);
      component.set(
        'assessmentContent',
        hash.learningMapsContent.learningMapsContent.assessment
      );
      component.set(
        'collectionContent',
        hash.learningMapsContent.learningMapsContent.collection
      );
      component.set(
        'courseContent',
        hash.learningMapsContent.learningMapsContent.course
      );
      component.set(
        'resourceContent',
        hash.learningMapsContent.learningMapsContent.resource
      );
      component.set(
        'questionContent',
        hash.learningMapsContent.learningMapsContent.question
      );
      component.set('isLoading', false);
      component.set('isContentNotAvailable', false);
    }, function() { //if API return any error
      component.set('isLoading', false);
      component.set('isContentNotAvailable', true);
    });
  },

  /**
   * @function getContentCountData
   * Function to get content wise count list
   */
  getContentCountData(contentCount) {
    let contentCountData = [];
    let courseCount = contentCount.course
      ? contentCount.course.totalHitCount
      : 0;
    let unitCount = contentCount.unit ? contentCount.unit.totalHitCount : 0;
    let lessonCount = contentCount.lesson
      ? contentCount.lesson.totalHitCount
      : 0;
    let collectionCount = contentCount.collection
      ? contentCount.collection.totalHitCount
      : 0;
    let assessmentCount = contentCount.assessment
      ? contentCount.assessment.totalHitCount
      : 0;
    let resourceCount = contentCount.resource
      ? contentCount.resource.totalHitCount
      : 0;
    let questionCount = contentCount.question
      ? contentCount.question.totalHitCount
      : 0;
    let rubricCount = contentCount.rubric
      ? contentCount.rubric.totalHitCount
      : 0;
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.COURSE, courseCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.UNIT, unitCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.LESSON, lessonCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.ASSESSMENT, assessmentCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.COLLECTION, collectionCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.RESOURCE, resourceCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.QUESTION, questionCount)
    );
    contentCountData.push(
      Utils.getStructuredContentData(CONTENT_TYPES.RUBRIC, rubricCount)
    );
    return contentCountData;
  }
});
