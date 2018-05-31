import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['global-statistics'],

  // -------------------------------------------------------------------------
  // Properties

  subjects: null,

  // -------------------------------------------------------------------------
  // Events

  actions:  {
    onSelectActiveUsers: function(subject) {
      this.sendAction('onSelectActiveUsers', subject);
    }
  }


});
