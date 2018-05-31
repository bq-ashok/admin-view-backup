import Ember from 'ember';
import { ACTIVITY_FILTER,
DEFAULT_ACTIVITY_FILTERS } from 'admin-dataview/config/config';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-summary-distribution-by-content'],

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * Search service to fetch content details
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * Session service to fetch current session information
   */
  session: Ember.inject.service('session'),


  /**
   * activities service dependency injection
   * @type {Object}
   */
  activityService: Ember.inject.service('api-sdk/activities'),


  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  init: function() {
    this._super(...arguments);
    this.getSearchContentCount();
  },

  /**
   * observer event triggered when the user hit search box
   */
  onChangeSearchTerm: Ember.observer('term', function() {
    let component = this;
    component.getSearchContentCount();
  }),

  /**
  * Observer to watch user event on filter changes
  */
  refreshItemsObserver: Ember.observer('onRefreshItems', function() {
    let component = this;
    component.getSearchContentCount();
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * It  indicates the state of loader icon
   * @type {Boolean}
   */
  isLoading: false,

  /**
   * Maintain resource subformat count data
   * @type {Array}
   */
  resources: Ember.A(),


  /**
   * Maintain question subformat count data
   * @type {Array}
   */
  questions: Ember.A(),

  /**
   * Maintain courses, units, lessons, collections and assessments  count data
   * @type {Array}
   */
  culcaCounts: Ember.A(),

  filterTypes: Ember.computed(function() {
    let controller = this;
    let defaultActivityFilters = DEFAULT_ACTIVITY_FILTERS;
    let activityFilter = ACTIVITY_FILTER;
    return defaultActivityFilters.concat(activityFilter);
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get Content subformat count of search results
   * return hashed json of each content subformats
   */
  getSearchContentCount: function() {
    let component = this;
    let appliedFilters = component.getAppliedFilters();
    let term = component.get('term') || '*';
    let start = 1;
    let length = 0;
    component.set('isLoading', true);
    let aggregatedFilters = {
      'aggBy': 'contentSubFormat'
    };
    aggregatedFilters = Object.assign(aggregatedFilters, appliedFilters);
    let aggregatedResourcePromise = Ember.RSVP.resolve(component.get('searchService').searchAggregatedResources(term, aggregatedFilters, start, length));
    let aggregatedQuestionPromise = Ember.RSVP.resolve(component.get('searchService').searchAggregatedQuestions(term, aggregatedFilters, start, length));
    const culacCountPromise = component.get('activityService').getLearningMaps(appliedFilters, term);
    return Ember.RSVP.hash({
      aggregatedResourceCount: aggregatedResourcePromise,
      aggregatedQuestionCount: aggregatedQuestionPromise,
      culacCount: culacCountPromise
    }).then((hash) => {
      let resourceCount = hash.aggregatedResourceCount.get('resourceCount');
      let resourceCounts = Ember.A([{
        'name': 'Audio',
        'value': resourceCount.audio_resource || 0,
        'colorCode': '#76C8BC'
      }, {
        'name': 'Videos',
        'value': resourceCount.video_resource || 0,
        'colorCode': '#3EB6A6'
      }, {
        'name': 'Interactive',
        'value': resourceCount.interactive_resource || 0,
        'colorCode': '#76C8BC'
      }, {
        'name': 'Images',
        'value': resourceCount.image_resource || 0,
        'colorCode': '#76C8BC'
      }, {
        'name': 'Webpages',
        'value': resourceCount.webpage_resource || 0,
        'colorCode': '#009A87'
      }, {
        'name': 'Text',
        'value': resourceCount.text_resource || 0,
        'colorCode': '#76C8BC'
      }]);
      component.set('resources', resourceCounts);

      let questionCount = hash.aggregatedQuestionCount.get('questionCount');
      let questionCounts = Ember.A([{
        'name': 'Multiple Choice',
        'value': questionCount.multiple_choice_question || 0,
        'colorCode': '#3A434D'
      }, {
        'name': 'Multiple Answer',
        'value': questionCount.multiple_answer_question || 0,
        'colorCode': '#6E767D'
      }, {
        'name': 'True Or False',
        'value': questionCount.true_false_question || 0,
        'colorCode': '#93999E'
      }, {
        'name': 'Fill In The Blank',
        'value': questionCount.fill_in_the_blank_question || 0,
        'colorCode': '#3A434D'
      }, {
        'name': 'Multiple Select - Image',
        'value': questionCount.hot_spot_image_question || 0,
        'colorCode': '#3A434D'
      }, {
        'name': 'Multiple Select - Text',
        'value': questionCount.hot_spot_text_question || 0,
        'colorCode': '#93999E'
      }, {
        'name': 'Highlight Text',
        'value': questionCount.hot_text_highlight_question || 0,
        'colorCode': '#93999E'
      }, {
        'name': 'Drag And Drop Order',
        'value': questionCount.hot_text_reorder_question || 0,
        'colorCode': '#3A434D'
      }, {
        'name': 'Open Ended',
        'value': questionCount.open_ended_question || 0,
        'colorCode': '#3A434D'
      }]);
      component.set('questions', questionCounts);

      // CULCA
      let courseCounts = hash.culacCount.get('course').get('totalHitCount');
      let unitCounts = hash.culacCount.get('unit').get('totalHitCount');
      let lessonCounts = hash.culacCount.get('lesson').get('totalHitCount');
      let collectionCounts = hash.culacCount.get('collection').get('totalHitCount');
      let assessmentCounts = hash.culacCount.get('assessment').get('totalHitCount');
      let culcaCounts = Ember.A([{
        'name': 'courses',
        'value': courseCounts
      }, {
        'name': 'units',
        'value': unitCounts
      }, {
        'name': 'lessons',
        'value': lessonCounts
      }, {
        'name': 'collections',
        'value': collectionCounts
      }, {
        'name': 'assessments',
        'value': assessmentCounts
      }]);
      component.set('culcaCounts', culcaCounts);
      component.set('isLoading', false);
    });
  },

  /**
   * @function getAppliedFilters
   * Get user applied filters from the local storage
   */
  getAppliedFilters() {
    let component = this;
    let userId = component.get('session.id');
    let appliedFilters = JSON.parse(localStorage.getItem(`research_${userId}_activities_filters`));
    let filterTypes = component.get('filterTypes');
    let formattedFilters = {};
    if (appliedFilters) {
      filterTypes.map( filterTypeInfo => {
        let filterType = filterTypeInfo.code;
        let categorizedFilter = appliedFilters[`${filterType}`] || null;
        if (categorizedFilter) {
          formattedFilters = Object.assign(formattedFilters, component.getFormattedSearchFilters(filterType, categorizedFilter));
        }
      });
    }
    return formattedFilters;
  },

  /**
   * @function getFormattedSearchFilters
   * Get formatted filters
   */
  getFormattedSearchFilters(filterType, categorizedFilterData) {
    let controller = this;
    let formattedFilters = {};
    let delimiter = ',';
    switch (filterType) {
    case 'category':
      formattedFilters['flt.subjectClassification'] = categorizedFilterData[0] ? categorizedFilterData[0].id : '';
      break;
    case 'subject':
      categorizedFilterData.map( filterData => {
        formattedFilters['flt.subject'] = filterData.id;
      });
      break;
    case 'course':
      delimiter = ',';
      formattedFilters['flt.course'] = controller.getConcatenatedFilterString(categorizedFilterData, delimiter, 'id');
      break;
    case 'audience':
      formattedFilters['flt.audience'] = controller.getConcatenatedFilterString(categorizedFilterData);
      break;
    case '21-century-skills':
      delimiter = '~~';
      formattedFilters['flt.21CenturySkills'] = controller.getConcatenatedFilterString(categorizedFilterData, delimiter);
      break;
    case 'licenses':
      delimiter = '~~';
      formattedFilters['flt.licenseName'] = controller.getConcatenatedFilterString(categorizedFilterData, delimiter);
      break;
    case 'dok':
      formattedFilters['flt.depthOfKnowledge'] = controller.getConcatenatedFilterString(categorizedFilterData);
      break;
    case 'publisher':
      delimiter = '~~';
      formattedFilters['flt.publisher'] = controller.getConcatenatedFilterString(categorizedFilterData, delimiter);
      break;
    }
    return formattedFilters;
  },

  /**
   * @function getConcatenatedFilterString
   * Get search filter using applied filters
   */
  getConcatenatedFilterString( filterInfo, delimiter = ',', keyName = 'label' ) {
    let label = '';
    if (Ember.isArray(filterInfo)) {
      filterInfo.map( filterData => {
        label += delimiter + filterData[`${keyName}`] ;
      });
      let numOfCharsRemove = delimiter === ',' ? 1 : 2;
      return label.substring(numOfCharsRemove);
    }
    return label;
  }
});
