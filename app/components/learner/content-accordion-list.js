import Ember from 'ember';
import { formatTime } from 'admin-dataview/utils/utils';

export default Ember.Component.extend({

  //------------------------------------------------------------------------
  //Attributes

  classNames: ['content-accordion-list'],

  classNameBindings: ['isExpanded:expanded:collapsed'],

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:learners
   */
  learnersService: Ember.inject.service('api-sdk/learners'),

  //------------------------------------------------------------------------
  //Actions

  actions: {
    /**
     * @function onShowingContentAccordion
     * Action triggerred when an user click accordion title
     */
    onShowingContentAccordion: function(contentType) {
      let component = this;
      let userId = component.get('userId');
      let activeDuration = component.get('activeDuration');
      let accordionBody = component.$('.accordion .accordion-body');
      if (component.get('isExpanded')) {
        component.set('isLoading', false);
        accordionBody.slideUp();
        component.toggleProperty('isExpanded');
      } else {
        component.set('isLoading', true);
        accordionBody.slideDown();
        let resourcePromise = Ember.RSVP.resolve(component.get('learnersService').getUserStatsContentByType(userId, contentType, activeDuration));
        return Ember.RSVP.hash({
          resourceData: resourcePromise
        })
          .then(function(hash) {
            component.set('resourceData', hash.resourceData);
            component.toggleProperty('isLoading');
            component.toggleProperty('isExpanded');
          });
      }
    }
  },

  //------------------------------------------------------------------------
  //Properties

  /**
   * @property {Boolean}
   * Show/hide expanded accordion body
   */
  isExpanded: false,

  /**
   * @property {Array}
   * List of resource data
   */
  resourceData: [],

  /**
   * @property {Boolean}
   * Show/hide loading animation
   */
  isLoading: false,

  /**
   * @property {String}
   * Total time spent on each resource type
   */
  resourceTimeSpent: null,

  /**
   * User id of time spent activites
   * @type {String}
   */
  userId: null,

  /**
   * active duration filter
   * @type {String}
   */
  activeDuration: '3m',

  /**
   * Observer triggerred when a component get resourceData
   */
  resourceDataObserver: Ember.observer('resourceData', function() {
    let component = this;
    let resourceData = component.get('resourceData');
    let totalTimeInMilliSec = 0;
    resourceData.map(resource => {
      totalTimeInMilliSec += resource.resourceTimeSpent;
    });
    component.set('resourceTimeSpent', formatTime(totalTimeInMilliSec));
  })
});
