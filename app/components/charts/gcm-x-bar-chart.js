import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['charts', 'gcm-x-bar-chart'],

  // -------------------------------------------------------------------------
  // Properties
  /**
   *
   * Sample
   * [
   *    {
   *      color: failColor,
   *      percentage: Math.round(dataObj.incorrect / dataObj.total * 100)
   *    },
   *    {
   *      color: correctColor,
   *      percentage: Math.round(dataObj.correct / dataObj.total * 100)
   *    },
   *    ...
   *  ]
   * @property {Array} options data
   */
  data: null,


  styles: Ember.computed('data', function() {
    let data = this.get('data');
    if(data.percentage >= 100) {
      data.percentage =  100;
    }
    return Ember.String.htmlSafe(
      `background-color: ${'#37424b'}; width: ${data.percentage}%;`
    );
  })


});
