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
   * @requires service:content
   */
  contentService: Ember.inject.service('api-sdk/content'),
  /**
   * @requires controller:activity
   */
  activityController: Ember.inject.controller('activity'),

  /**
   * @requires service:profile
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  //-------------------------------------------------------------------------
  //Actions

  actions: {
    showMoreResults() {
      let controller = this;
      controller.fetchSearchCourses();
    },

    onShowPullOut(course) {
      let controller = this;
      controller.set('isLoadingPullout', true);
      controller.getCourseContentById(course.id).then(function(courseContentData) {
        controller.set('coursePullOutData', courseContentData);
        controller
          .fetchUserProfileById(course.lastModifiedBy)
          .then(function(userProfileData) {
            course.lastModifiedUser = userProfileData;
            controller.set('selectedCourse', course);
            controller.set('showPullOut', true);
            controller.set('isLoadingPullout', false);
          });
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
   * It maintains the list of course data
   * @type {Array}
   */
  courses: Ember.A(),

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
  isShowMoreVisible: Ember.computed('courses', function() {
    let controller = this;
    let CUR_ITERATION_COUNT = controller.get('CUR_ITERATION_COUNT');
    let PAGE_SIZE = controller.get('PAGE_SIZE');
    return PAGE_SIZE <= CUR_ITERATION_COUNT;
  }),

  /**
   * @property {Array}
   * Selectee course data
   */
  selectedCourse: null,

  coursePullOutData: null,

  /**
   * Grouping the data to show more info  in pull out
   */
  groupData: Ember.computed('selectedCourse', function() {
    let controller = this;
    let course = controller.get('selectedCourse');
    let defaultVectorValue = 0.5;
    let resultSet = Ember.A();
    if (course) {
      let coursePullOutData = controller.get('coursePullOutData');
      resultSet = {
        descriptive: {
          title: course.title,
          description: truncateString(course.description)
        },

        creation: {
          'Created On': moment(course.createdDate).format('MMMM DD, YYYY') || null,
          Publisher: 'Gooru Org',
          'Publish Status': course.isPublished ? 'Published' : 'Unpublished',
          Aggregator: course.aggregator ? course.aggregator : null,
          'Modified On': moment(course.lastModified).format('MMMM DD, YYYY') || null,
          'Modified By':
            course.lastModifiedUser.username || course.lastModifiedBy,
          License: coursePullOutData.license
            ? coursePullOutData.license
            : 'Public Domain',
          Host: null
        },

        educational: {
          Audience: course.audience
        },

        media: {
          Keywords: null,
          Visibility: coursePullOutData.visible_on_profile ? 'True' : 'False'
        },

        instructional: {
          '21st Century Skills': null
        },

        framework: {
          subject: course.taxonomySubject,
          'Course': course.taxonomyCourse,
          domain: course.taxonomyDomain,
          Standards: coursePullOutData.taxonomy[0].code || null
        },

        vector: {
          relevance: course.relevance || defaultVectorValue,
          engagment: course.engagment || defaultVectorValue,
          efficacy: course.efficacy || defaultVectorValue
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
    controller.set('courses', Ember.A());
    controller.set('OFFSET', 0);
    controller.fetchSearchCourses();
  },

  /**
   * @function fetchSearchCourses
   * Fetch courses by appliying search filters
   */
  fetchSearchCourses() {
    let controller = this;
    let term = controller.get('term') ? controller.get('term') : '*';
    let PAGE_SIZE = controller.get('PAGE_SIZE');
    let OFFSET = controller.get('OFFSET');
    let courseFilters = controller
      .get('activityController')
      .getAppliedFilters();
    Ember.RSVP.hash({
      courses: controller
        .get('searchService')
        .searchCourses(term, courseFilters, OFFSET, PAGE_SIZE)
    }).then(({ courses }) => {
      let fetchedCourses = controller.get('courses');
      let CUR_ITERATION_COUNT = courses.get('searchResults').length;
      controller.set(
        'courses',
        fetchedCourses.concat(courses.get('searchResults'))
      );
      controller.set('CUR_ITERATION_COUNT', CUR_ITERATION_COUNT);
      controller.set('OFFSET', OFFSET + CUR_ITERATION_COUNT);
      controller.set('hitCount', courses.get('hitCount'));
      controller.set('isLoading', false);
    });
  },

  getCourseContentById(courseId) {
    let controller = this;
    return Ember.RSVP.hash({
      course: Ember.RSVP.resolve(
        controller.get('contentService').getCourseById(courseId)
      )
    }).then(function(courseData) {
      return courseData.course;
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
