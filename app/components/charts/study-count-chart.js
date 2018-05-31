import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['charts', 'study-count-chart'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {String} color - Hex color value for the bar in the bar chart
   */
  color: 'blue',

  /**
   * @property {Number} completed - Completed number out of the total
   */
  completed: 0,

  /**
   * @property {String} total - Value equal to 100% of the bar chart
   */
  total: 0,

  /**
   * @property {Number} completedPercentage
   */
  totalPercentage: Ember.computed('completed', 'total', function() {
    var total = this.get('total');
    var percentage = 0;

    if (typeof total === 'number' && total !== 0) {
      percentage = Math.round(30 / total * 100);
    }
    return percentage > 100 ? 100 : percentage;
  }),

  /**
   * @property {Number} barChartData
   */
  barChartData: Ember.computed('totalPercentage', function() {
    return [{
      color: this.get('color'),
      percentage: this.get('completedPercentage')
    }];
  })
});
