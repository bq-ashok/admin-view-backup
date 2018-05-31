import Ember from 'ember';

export default Ember.Route.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:performance
   */
  performanceService: Ember.inject.service('api-sdk/performance'),

  //-------------------------------------------------------------------------
  //Properties

  queryParams: {
    courseId: {
      refreshModel: true
    },
    classId : {
      refreshModel: true
    },
    courseTitle : {
      refreshModel: true
    }
  },

  courseId: null,

  // -------------------------------------------------------------------------
  // Methods
  beforeModel: function(transition) {
    let route = this;
    route.set('courseId', transition.params['learner.courses'].courseId);
  },

  model: function(params) {
    let route = this;
    let learnerModel = route.modelFor('learner');
    let userId = learnerModel.userId;
    let courseId = route.get('courseId');
    let classId = params.classId;
    let courseName = params.courseTitle;
    let unitsPromise = Ember.RSVP.resolve(route.get('performanceService').getUserPerformanceUnits(userId, courseId, classId));
    return Ember.RSVP.hash({
      userPerformanceUnits: unitsPromise,
      courseId: courseId,
      userId: userId,
      classId: classId,
      courseName : courseName
    })
      .then(function(hash) {
        return hash;
      });
  },


  setupController: function(controller, model) {
    controller.set('userPerformanceUnits', model.userPerformanceUnits);
    controller.set('userId', model.userId);
    controller.set('courseId', model.courseId);
    controller.set('classId', model.classId);
    controller.set('currrentCourseName',model.courseName);
  }

});
