import Ember from 'ember';

/**
 * Reopen the session object and added attributes which are used to handle session.
 * @param  {Object} instance
 */
export function initialize(instance) {
  const sessionService = instance.container.lookup('service:session');

  sessionService.reopen({

    /**
     * @property {string} access token
     */
    accessToken: Ember.computed.alias('data.authenticated.accessToken'),

    /**
     * @property {string} Session user data
     */
    user: Ember.computed.alias('data.authenticated.user'),

    /**
     * @property {string} Session user data
     */
    cdnUrls: Ember.computed.alias('data.authenticated.cdnUrls'),

    /**
     * @property {string} Session user id
     */
    id: Ember.computed.alias('data.authenticated.user.id'),

    /**
     * @property {boolean} Indicates if the session is for an anonymous user
     */
    isAuthenticated:  Ember.computed('data.authenticated', function() {
      return this.get('data.authenticated').isAuthenticated;
    }),

    /**
     * @property {string} session tenant id
     */
    tenantId: Ember.computed.alias('data.authenticated.tenant.tenantId'),

    /**
     * @property {string} session partner id
     */
    partnerId: Ember.computed.alias('data.authenticated.partnerId')

  });
}

export default {
  name: 'application-session-service',
  after: 'ember-simple-auth',
  initialize: initialize
};
