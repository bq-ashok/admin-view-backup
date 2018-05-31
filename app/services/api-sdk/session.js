
import Ember from 'ember';

export default Ember.Service.extend({

  session: Ember.inject.service('session'),

  /**
   * Creates a session with the specified access token
   * @param token - the access token
   * @returns {*|Ember.RSVP.Promise}
   */
  authenticateWithToken: function(token) {
    return this.get('session').authenticate('authenticator:auth-api-3', token);
  },

  /**
   * Updates a session userData
   * @param userData - the user data
   */
  updateUserData: function(userData) {
    const session = this.get('session');
    session.set('user', userData);
  }

});
