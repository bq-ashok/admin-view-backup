/**
 * Radial progress chart
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

  classNames: ['radial-progress-chart'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    const $component = this.$();
    const component = this;
    const strokeWidth = parseInt(component.$('svg circle').css('stroke-width'), 10);
    const width = parseInt($component.width());
    const xRadius = (width / 2);
    const yRadius = (width / 2);
    const radius = ((width / 2) - strokeWidth);
    const dataOffset = (Math.PI * (radius * 2));
    const yText = yRadius + 5;

    // Get the component dimensions from the css
    this.setProperties({
      height: parseInt($component.height()),
      width: width,
      xRadius: xRadius,
      yRadius: yRadius,
      radius: radius,
      strokeWidth: strokeWidth,
      dataOffset: dataOffset,
      yText: yText
    });

    this.drawChart();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} width
   */
  width: null,

  /**
   * @property {Number} height
   */
  height: null,

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


  // -------------------------------------------------------------------------
  // Methods

  drawChart: function() {
    let component = this;
    let val = component.get('precentage');
    let circle = component.$('svg #bar');

    if (isNaN(val)) {
      val = 100;
    } else {
      let r = component.get('radius');
      let c = Math.PI * (r * 2);
      if (val < 0) {
        val = 0;
      }
      if (val > 100) {
        val = 100;
      }
      let pct = ((100 - val) / 100) * c;
      circle.css({
        strokeDashoffset: pct
      });
    }
  }


});
