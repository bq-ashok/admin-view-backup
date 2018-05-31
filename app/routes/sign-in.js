import Ember from 'ember';

export default Ember.Route.extend({

  /**
   * The session service.
   * @property session
   * @readOnly
   */
  session: Ember.inject.service('session'),

  beforeModel: function() {
    let sessionService = this.get('session');
    if (sessionService.get('isAuthenticated')) {
      this.get('session').invalidate();
    }
    window.location.replace('/sign-in');
  }

});
