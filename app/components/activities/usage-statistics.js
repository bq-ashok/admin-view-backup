import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['usage-statistics'],

  // -------------------------------------------------------------------------
  // Properties

  subjects: null,

  usage: null

  //
  // usage: Ember.computed(function() {
  //   let usageStatistics = [
  //     {
  //       total: 600000,
  //       name: 'average time spent'
  //     },
  //     {
  //       total: 1300000,
  //       name: 'view count'
  //     },
  //     {
  //       total: 4000000,
  //       name: 'remixed count'
  //     },
  //     {
  //       total: 5000,
  //       name: 'times studied'
  //     }
  //   ];
  //
  //   return usageStatistics;
  // })

  // -------------------------------------------------------------------------
  // Events
});
