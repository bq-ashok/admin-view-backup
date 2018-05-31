import Ember from 'ember';
import TaxonomyTag from 'admin-dataview/models/taxonomy/taxonomy-tag';
import {PLAYER_WINDOW_NAME, PLAYER_EVENT_SOURCE} from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-course-card'],

  // -------------------------------------------------------------------------
  // Events
  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * course object
   * @type {Object}
   */
  course: null,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed(
    'course.taxonomy.[]',
    function() {
      return TaxonomyTag.getTaxonomyTags(this.get('course.taxonomy'));
    }
  ),

  actions: {
    onShowPullOut: function(course) {
      this.sendAction('onShowPullOut', course);
    },

    onPlayCourse(courseId) {
      let locOrigin = window.location.origin;
      let courseUrl = `/content/courses/play/${courseId}?source=${PLAYER_EVENT_SOURCE.RGO}`;
      let playerURL = locOrigin + courseUrl;
      window.open(playerURL, PLAYER_WINDOW_NAME);
    }
  }

});
