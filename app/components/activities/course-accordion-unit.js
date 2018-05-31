import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['course-accordion-unit'],

  /**
   * @requires service:content
   */
  contentService: Ember.inject.service('api-sdk/content'),

  isExpanded: false,

  unit: null,

  lessons: null,

  actions: {
    onToggle(unitId) {
      let component = this;
      component.fetchLessons(unitId);
    }
  },

  fetchLessons(unitId) {
    let component = this;
    let unitBody = component.$('.unit-body');
    if (component.get('isExpanded')) {
      unitBody.slideUp();
    } else {
      let courseId = component.get('courseId');
      let lessonPromise = Ember.RSVP.resolve(component.get('contentService').getLessonByUnitId(courseId, unitId));
      Ember.RSVP.hash({
        lessonData: lessonPromise
      })
        .then(function(hash) {
          component.set('lessons', hash.lessonData.lessonSummary);
          component.set('isExpanded', true);
          unitBody.slideDown();
        });
    }
    component.toggleProperty('isExpanded');
  }
});
