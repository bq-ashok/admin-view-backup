import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['competencies-report-panel'],


  //------------------------------------------------------------------------
  //Dependencies

  /**
   * taxonomy service dependency injection
   * @type {Object}
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * It  will have default subject category
   * @type {String}
   */
  selectedSubjectCategory: 'k_12',

  /**
   * It  will have Subject
   * @type {Object}
   */
  taxonomySubjects: null,

  /**
   * It  will have Subject
   * @type {Object}
   */
  currentSubject: null,

  /**
   * It  will have selected courseId
   * @type {Object}
   */
  isSelectedCourseId: null,


  isCompetency: Ember.computed('isCompetencyTabs', function() {
    let component = this;
    return component.get('isCompetencyTabs');
  }),

  isJourney: Ember.computed('isJourneyTabs', function() {
    let component = this;
    return component.get('isJourneyTabs');
  }),

  /**
   * It  will have course title
   * @type {Object}
   */
  isSelectedCourse: null,

  /**
   * It  will have Subject title
   * @type {Object}
   */
  isSelectedSubject: null,


  //------------------------------------------------------------------------
  // actions

  actions: {

    competencyMatrixTabs: function(tabs) {

      let component = this;
      component.set('isCompetency', tabs === 'competency');
      component.set('isJourney', tabs === 'journey');
      component.sendAction('competencyTabs', tabs);
    },


    selectedSubject: function(subject) {
      let component = this;
      component.sendAction('subjectChange', subject);
    },

    selectedCourse: function(course) {
      let component = this;
      component.sendAction('courseChange', course);
    }

  }

});
