/**
 * Slider chart
 *
 * @module
 * @augments ember/Component
 */
import Ember from 'ember';


export default Ember.Component.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['slider-chart'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    this.drawChart();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Value of radial
   * @return {Number}
   */
  value: 0,

  /**
   * Max Value of radial
   * @return {Number}
   */
  maxValue: 10,

  /**
   * Precentage of progress chart
   * @return {Number}
   */
  precentage: Ember.computed(function() {
    let value = this.get('value');
    let maxValue = this.get('maxValue');
    return ((((value / maxValue) * 100) / 100) * 100);
  }),

  /**
   * slider drag icon size
   * @return {Number}
   */
  size: 0,

  // -------------------------------------------------------------------------
  // Methods

  drawChart: function() {
    let precentage = this.get('precentage');
    if (precentage >= 100) {
      this.set('size', 7);
    } else if(precentage >= 80 && precentage < 100) {
      this.set('size', 6);
    } else if(precentage >= 60 && precentage < 80) {
      this.set('size', 5);
    } else if(precentage >= 50 && precentage < 60) {
      this.set('size', 4);
    } else if(precentage >= 30 && precentage < 50) {
      this.set('size', 3);
    } else {
      this.set('size', 0);
    }
    if(precentage > 50) {
      this.$('#slider-drag').attr('style', 'stroke:#4a8cdb');
    } else {
      this.$('#slider-drag').attr('style', 'stroke:#db4a4a');
    }

  }


});
