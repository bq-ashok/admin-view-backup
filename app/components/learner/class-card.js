import Ember from 'ember';

export default Ember.Component.extend({


  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['learner', 'class-card'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Triggered when an menu item is selected
     * @param item
     */
    selectItem: function(item) {
      const classId = this.get('class.id');
      if (this.get('onItemSelected')) {
        this.sendAction('onItemSelected', item, classId);
      }
    },

    courseReport: function(course) {
      let courseId =  course.courseId;
      let queryParams = {
        classId : course.classId,
        courseTitle: course.courseTitle
      };
      this.get('router').transitionTo('learner.courses', courseId, {queryParams});
    }
  },
  // -------------------------------------------------------------------------
  // Events

  init: function() {
    const component = this;
    component._super(...arguments);
  },

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Class} class information
   */
  class: null,

  /**
   * @property {Number} score percentage
   * Computed property for performance score percentage
   */
  scorePercentage: Ember.computed('course.averageScore', function() {
    const scorePercentage = this.get('course.averageScore');
    return scorePercentage >= 0 && scorePercentage !== null ?
      `${Math.round(scorePercentage)}%` :
      '-';
  })


});
