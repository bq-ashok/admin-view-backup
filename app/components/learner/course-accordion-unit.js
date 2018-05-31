import Ember from 'ember';
import {formatTime, getBarGradeColor as getGradeColor} from 'admin-dataview/utils/utils';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['course-accordion-unit'],

  classNameBindings: ['isExpanded:expanded:collapsed'],

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:performance
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  //------------------------------------------------------------------------
  //Actions

  actions: {
    onClickUnitTitle: function(unitId) {
      let component = this;
      let unitBody =   component.$('.unit-content .unit-body');
      let userId = component.get('userId');
      let courseId = component.get('courseId');
      let classId = component.get('classId');
      if (component.get('isExpanded')) {
        component.toggleProperty('isExpanded');
        unitBody.slideUp();
      } else {
        unitBody.slideDown();
        component.set('isLoading', true);
        let lessonPromise = Ember.RSVP.resolve(component.get('performanceService').getUserPerformanceLessons(userId, courseId, unitId, classId));
        return Ember.RSVP.hash({
          lessons: lessonPromise
        })
          .then(function(hash) {
            component.set('lessons', hash.lessons);
            component.toggleProperty('isExpanded');
            component.toggleProperty('isLoading');
          });
      }
    }
  },

  //------------------------------------------------------------------------
  //Properties

  /**
   * @property {Array}
   * Store current unit item
   */
  unit: [],

  /**
   * @property {Boolean}
   * show/hide unit body view
   */
  isExpanded: false,

  /**
   * @property {Boolean}
   * show/hide loading spinner
   */
  isLoading: true,

  /**
   * @property {Array}
   * Store lessons data
   */
  lessons: [],

  /**
   * @property {String}
   * Store formatted unit timespent value
   */
  timespent: Ember.computed('unit', function() {
    let component = this;
    let assessmentTimespent = component.get('unit.unitAsmtTimeSpent');
    let collectionTimespent = component.get('unit.unitCollTimeSpent');
    return formatTime(assessmentTimespent + collectionTimespent);
  }),

  /**
   * @property {Color}
   * Grade color code
   */
  colorStyle: Ember.computed('unit.unitAsmtScore', function() {
    let component = this;
    let score = component.get('unit.unitAsmtScore');
    return getGradeColor(score);
  })

});
