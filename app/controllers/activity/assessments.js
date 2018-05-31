import Ember from 'ember';
import { truncateString } from 'admin-dataview/utils/utils';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Query

  queryParams: ['term'],

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * @requires service:profile
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * @requires service:content
   */
  contentService: Ember.inject.service('api-sdk/content'),

  /**
   * @requires controller:activity
   */
  activityController: Ember.inject.controller('activity'),

  //-------------------------------------------------------------------------
  //Actions

  actions: {
    showMoreResults() {
      let controller = this;
      controller.fetchSearchAssessments();
    },

    onShowPullOut(assessment) {
      let controller = this;
      controller.set('isLoadingPullout', true);
      controller.fetchAssessmentPullOutData(assessment.id);
      controller
        .fetchUserProfileById(assessment.lastModifiedBy)
        .then(function(userProfileData) {
          assessment.lastModifiedUser = userProfileData;
          controller.set('selectedAssessment', assessment);
          controller.set('showPullOut', true);
          controller.set('isLoadingPullout', false);
        });
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this.set('isLoading', true);
  },

  //-------------------------------------------------------------------------
  //Properties

  /**
   * It maintains the list of assessment data
   * @type {Array}
   */
  assessments: Ember.A(),

  /**
   * It maintains the search total hitcount
   * @type {Number}
   */
  hitCount: 0,

  /**
   * @property {Number}
   * Defines how many results should fetch
   */
  PAGE_SIZE: 9,

  /**
   * @property {Number}
   * Maintain current offset of the search API
   */
  OFFSET: 0,

  /**
   * @property {Boolean}
   * Toggle show/hide view of three bounce spinner
   */
  isLoading: false,

  /**
   * @property {Number}
   * Holds currently fetched results count
   */
  CUR_ITERATION_COUNT: 0,

  /**
   * @property {Boolean}
   * Show/Hide show more button
   */
  isShowMoreVisible: Ember.computed('assessments', function() {
    let controller = this;
    let CUR_ITERATION_COUNT = controller.get('CUR_ITERATION_COUNT');
    let PAGE_SIZE = controller.get('PAGE_SIZE');
    return PAGE_SIZE <= CUR_ITERATION_COUNT;
  }),

  /**
   * @property {Boolean}
   * Show/Hide pull out
   */
  showPullOut: false,

  /**
   * Currently selected assessment data
   */
  selectedAssessment: null,

  /**
   * Asssessment Pullout Data
   */
  assessmentPullOutData: null,

  /**
   * Grouping the data to show more info  in pull out
   */
  groupData: Ember.computed('selectedAssessment', function() {
    let assessment = this.get('selectedAssessment');
    let resultSet = Ember.A();
    let defaultVectorValue = 0.5;
    if (assessment) {
      resultSet = {
        descriptive: {
          title: assessment.title,
          description: truncateString(assessment.description)
        },

        creation: {
          Publisher: 'Gooru Org',
          'Publish Status': assessment.publishStatus ? 'Published' : 'Unpublished',
          Collaborator: assessment.collaboratorIDs,
          'Created by': assessment.creator.username,
          Aggregator: assessment.aggregator ? assessment.aggregator : null,
          'Modified by':
            assessment.lastModifiedUser.username || assessment.lastModifiedBy,
          'Date Modified':
            moment(assessment.lastModified).format('MMMM DD, YYYY') || null,
          License: assessment.license ? assessment.license.code : 'Public Domain'
        },

        educational: {
          Audience: assessment.audience,
          'Grade Level': assessment.grade,
          'Learning Objective': assessment.learningObjectives
        },

        media: {
          Keywords: assessment.keyPoints,
          Visibility: assessment.publishStatus === 'published' ? 'True' : 'False'
        },

        instructional: {
          'Instructional Model': assessment.instructionalModel,
          '21st Century Skills': assessment.skills
        },

        framework: {
          subject: assessment.taxonomySet.subject,
          course: assessment.taxonomySet.course,
          domain: assessment.taxonomySet.domain,
          standard: null
        },

        vector: {
          relevance: assessment.relevance || defaultVectorValue,
          engagment: assessment.engagment || defaultVectorValue,
          efficacy: assessment.efficacy || defaultVectorValue
        }
      };
    }
    return resultSet;
  }),

  /**
   * Grouping header data to show more info  in pull out
   */
  groupHeader: Ember.computed('groupData', function() {
    let resultHeader = Ember.A();
    resultHeader = [
      Ember.Object.create({
        header: 'extracted',
        isEnabled: true
      }),
      Ember.Object.create({
        header: 'curated',
        isEnabled: true
      }),
      Ember.Object.create({
        header: 'tagged',
        isEnabled: true
      }),
      Ember.Object.create({
        header: 'computed',
        isEnabled: true
      })
    ];
    return resultHeader;
  }),
  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  onChangeSearchTerm: Ember.observer('term', function() {
    let controller = this;
    let term = controller.get('term');
    if (term) {
      controller.refreshItems();
    }
  }),

  /**
   * @function refreshItems
   * Method to refresh search items
   */
  refreshItems() {
    let controller = this;
    controller.set('isLoading', true);
    controller.set('OFFSET', 0);
    controller.set('assessments', Ember.A());
    controller.fetchSearchAssessments();
  },

  /**
   * @function fetchSearchCourses
   * Fetch courses by appliying search filters
   */
  fetchSearchAssessments() {
    let controller = this;
    let term = controller.get('term') ? controller.get('term') : '*';
    let PAGE_SIZE = controller.get('PAGE_SIZE');
    let OFFSET = controller.get('OFFSET');
    let assessmentFilters = controller
      .get('activityController')
      .getAppliedFilters();
    Ember.RSVP.hash({
      assessments: controller
        .get('searchService')
        .searchAssessments(term, assessmentFilters, OFFSET, PAGE_SIZE)
    }).then(({ assessments }) => {
      let fetchedAssessments = controller.get('assessments');
      let CUR_ITERATION_COUNT = assessments.get('searchResults').length;
      controller.set(
        'assessments',
        fetchedAssessments.concat(assessments.get('searchResults'))
      );
      controller.set('CUR_ITERATION_COUNT', CUR_ITERATION_COUNT);
      controller.set('OFFSET', OFFSET + CUR_ITERATION_COUNT);
      controller.set('hitCount', assessments.get('hitCount'));
      controller.set('isLoading', false);
    });
  },

  fetchAssessmentPullOutData(assessmentId) {
    let controller = this;
    let assessmentPromise = Ember.RSVP.resolve(
      controller.get('contentService').getAssessmentById(assessmentId)
    );
    return Ember.RSVP.hash({
      assessment: assessmentPromise
    }).then(function(hash) {
      controller.set('assessmentPullOutData', hash.assessment);
    });
  },

  /**
   * @function fetchUserProfileById
   * Fuction to fetch user info using userId
   */
  fetchUserProfileById(userId) {
    let controller = this;
    return Ember.RSVP.hash({
      profile: Ember.RSVP.resolve(
        controller.get('profileService').readUserProfile(userId)
      )
    }).then(function(profileData) {
      return profileData.profile;
    });
  }
});
