import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['learner', 'independent-course-card'],


  //------------------------------------------------------------------------
  // Events

  actions: {

    courseReport: function(course) {
      let queryParams = {
        courseTitle: course.courseTitle
      };
      this.get('router').transitionTo('learner.courses', course.courseId, {
        queryParams
      });
    }
  },


  // -------------------------------------------------------------------------
  // Properties

  Performances: Ember.computed(function() {
    let course = this.get('course');
    let percentagewidth = course.assessmentsCompleted / course.totalAssessments * 100;
    let objects = {
      percentage: Math.round(percentagewidth)
    };
    return objects;
  })


});
