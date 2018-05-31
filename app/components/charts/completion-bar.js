import Ember from 'ember';
import { getBarGradeColor } from 'admin-dataview/utils/utils';

/**
 * Performance and Completion Chart
 *
 * Component responsible for showing the Performance and Completion Chart.
 * This component takes the dimensions of height and width from the parent element.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['charts', 'completion-bar'],

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Events

  didRender: function() {
    this.$('[data-toggle="tooltip"]').tooltip();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} score
   * Property to store lesson's score
   */
  score: 0,

  /**
   * @property {String} widthStyle
   * Computed property to know the width of the bar
   */
  widthStyle: Ember.computed('score', function() {
    let component = this;
    let score = component.get('score');
    return Ember.String.htmlSafe(`width: ${score}%;`);
  }),

  /**
   * @property {String} barColor
   * Computed property to know the color of the small bar
   */
  colorStyle: Ember.computed('score', function() {
    let component = this;
    let score = component.get('score');
    return Ember.String.htmlSafe(
      `background-color: ${getBarGradeColor(score)};`
    );
  }),

  /**
   * @property {Boolean} isFull
   * Computed property to know if the completion is full
   */
  isFull: Ember.computed(function() {
    return 10 >= 100;
  })
});
