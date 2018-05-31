import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activities-distribution-by-content'],

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * Search service to fetch content details
   */
  searchService: Ember.inject.service('api-sdk/search'),

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    this.getSearchContentCount();
  },

  /**
   * Observe the filter changes
   */
  filtersObserver: Ember.observer('appliedFilterList', function() {
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

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Get Content subformat count of search results
   * return hashed json of each content subformats
   */
  getSearchContentCount() {
    let component = this;
    let term = component.get('term');
    term = term !== '' ? term : '*';
    let length = 0;
    let start = 0;
    component.set('isLoading', true);
    let aggregatedFilters = {
      aggBy: 'contentSubFormat'
    };
    let appliedFilterList = component.get('appliedFilterList');
    aggregatedFilters = Object.assign(aggregatedFilters, appliedFilterList);
    let aggregatedResourcePromise = Ember.RSVP.resolve(
      component
        .get('searchService')
        .searchAggregatedResources(term, aggregatedFilters, start, length)
    );
    let aggregatedQuestionPromise = Ember.RSVP.resolve(
      component
        .get('searchService')
        .searchAggregatedQuestions(term, aggregatedFilters, start, length)
    );
    return Ember.RSVP.hash({
      aggregatedResourceCount: aggregatedResourcePromise,
      aggregatedQuestionCount: aggregatedQuestionPromise
    }).then(hash => {
      let resourceCount = hash.aggregatedResourceCount.get('resourceCount');
      let resourceCounts = Ember.A([
        {
          name: 'Audio',
          value: resourceCount.audio_resource || 0,
          colorCode: '#93999E'
        },
        {
          name: 'Videos',
          value: resourceCount.video_resource || 0,
          colorCode: '#6E767D'
        },
        {
          name: 'Interactive',
          value: resourceCount.interactive_resource || 0,
          colorCode: '#93999E'
        },
        {
          name: 'Images',
          value: resourceCount.image_resource || 0,
          colorCode: '#93999E'
        },
        {
          name: 'Webpages',
          value: resourceCount.webpage_resource || 0,
          colorCode: '#3A434D'
        },
        {
          name: 'Text',
          value: resourceCount.text_resource || 0,
          colorCode: '#93999E'
        }
      ]);
      component.set('resources', resourceCounts);

      let questionCount = hash.aggregatedQuestionCount.get('questionCount');
      let questionCounts = Ember.A([
        {
          name: 'Multiple Choice',
          value: questionCount.multiple_choice_question || 0,
          colorCode: '#3A434D'
        },
        {
          name: 'Multiple Answer',
          value: questionCount.multiple_answer_question || 0,
          colorCode: '#6E767D'
        },
        {
          name: 'True Or False',
          value: questionCount.true_false_question || 0,
          colorCode: '#93999E'
        },
        {
          name: 'Fill In The Blank',
          value: questionCount.fill_in_the_blank_question || 0,
          colorCode: '#3A434D'
        },
        {
          name: 'Multiple Select - Image',
          value: questionCount.hot_spot_image_question || 0,
          colorCode: '#3A434D'
        },
        {
          name: 'Multiple Select - Text',
          value: questionCount.hot_spot_text_question || 0,
          colorCode: '#93999E'
        },
        {
          name: 'Highlight Text',
          value: questionCount.hot_text_highlight_question || 0,
          colorCode: '#93999E'
        },
        {
          name: 'Drag And Drop Order',
          value: questionCount.hot_text_reorder_question || 0,
          colorCode: '#3A434D'
        },
        {
          name: 'Open Ended',
          value: questionCount.open_ended_question || 0,
          colorCode: '#3A434D'
        }
      ]);
      component.set('questions', questionCounts);

      component.set('isLoading', false);
    });
  }
});
