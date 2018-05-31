import Ember from 'ember';

export default Ember.Route.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:journey
   */
  journeyService: Ember.inject.service('api-sdk/journey'),

  /**
   * @requires service:learners
   */
  learnersService: Ember.inject.service('api-sdk/learners'),

  //-------------------------------------------------------------------------
  //Properties

  // -------------------------------------------------------------------------
  // Methods


  model: function() {
    let learnerModel = this.modelFor('learner');
    let userId = learnerModel.userId;
    let controller = this;
    let selectedActiveDuration= learnerModel.selectedActiveDuration;
    return Ember.RSVP.hash({
      userStatsByCourse: controller.get('learnersService').getUserStatsByCourse(userId, selectedActiveDuration)
    }).then(({userStatsByCourse}) => {
      let classIds = Ember.A();
      let courseIds = Ember.A();
      userStatsByCourse.forEach(data => {
        if (data.get('classId')) {
          classIds.push(data.get('classId'));
        } else {
          courseIds.push(data.get('courseId'));
        }
      });
      let requestPayLoadInClass =  Ember.Object.create({
        'classIds' : classIds,
        'courseIds': []
      });
      let requestPayLoadIL =  Ember.Object.create({
        'classIds' : [],
        'courseIds': courseIds
      });
      return Ember.RSVP.hash({
        userJourneyByCourses: controller.get('journeyService').getUserJourneyByCourses(userId, requestPayLoadInClass),
        userJourneyByCoursesIndependent: controller.get('journeyService').getUserJourneyByCourses(userId, requestPayLoadIL)

      });
    });
  },

  setupController: function(controller, model) {
    controller.set('userJourneyByCoursesInClass', model.userJourneyByCourses);
    controller.set('userJourneyByCoursesOutClass', model.userJourneyByCoursesIndependent);
    controller.set('userId', this.get('userId'));
  }

});
