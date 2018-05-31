import Ember from 'ember';

export default Ember.Route.extend({

  // --------------------------------------------------------------------------
  // Dependencies

  /**
   * It has the session object of ember-simple-auth
   * @property {Session}
   */
  session: Ember.inject.service('session'),

  sessionService: Ember.inject.service('api-sdk/session'),


  // --------------------------------------------------------------------------
  // Methods

  beforeModel: function() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('competency');
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    const session = this.get('session');
    controller.set('session', session);
  }
});
