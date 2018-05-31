import Ember from 'ember';

export default Ember.Component.extend({


  classNames: ['competencies-journeys-list'],


  // -------------------------------------------------------------------------
  // Properties

  /**
   * It  will have Subject
   * @type {String}
   */
  isSelectedSubject: null,

  /**
   * It  will have Subject
   * @type {String}
   */
  isSelectedCourse: null,


  /**
   * It  will have selected courseId
   * @type {String}
   */
  isSelectedCourseId: null,


  //------------------------------------------------------------------------
  // actions

  actions: {
    chooseSubject: function(subject) {
      let component = this;
      component.set('isSelectedSubject', subject.subjectTitle);
      component.sendAction('selectedSubject', subject);
    },

    chooseCourse: function(course) {
      let component = this;
      component.set('isSelectedCourse', course.courseTitle);
      component.sendAction('selectedCourse', course);
    }
  }
});
