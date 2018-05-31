import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

/**
 * The Ember Simple Auth authenticator for Admin
 *
 * @typedef {Object} Admin Auth API
 */
export default BaseAuthenticator.extend({
  authenticationService: Ember.inject.service('api-sdk/authentication'),

  restore(data) {
    return Ember.RSVP.resolve(data);
  },

  authenticate(accessToken) {
    return this.get('authenticationService')
      .authenticateWithToken(accessToken)
      .then(response => {
        response.accessToken = accessToken;
        return response;
      });
  }
});
