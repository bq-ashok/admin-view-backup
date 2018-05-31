import Ember from 'ember';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {course} course information
   */
  course: null,

  /**
   * @property {userId} user information
   */
  userId: null,

  //------------------------------------------------------------------------
  // Events

  actions: {
    onClickBackButton() {
      this.transitionToRoute('learner');
    }
  }
});
