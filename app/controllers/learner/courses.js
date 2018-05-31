import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Query

  queryParams: ['courseId', 'classId', 'courseTitle'],

  courseId: null,

  classId: null,

  courseTitle: null,

  actions: {
    onClickBackButton() {
      let controller = this;
      controller.transitionToRoute('learner');
    }
  }
});
