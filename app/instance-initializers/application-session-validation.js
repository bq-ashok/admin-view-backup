import Ember from 'ember';

/**
 * Initialize session validation function
 */
export function initialize(instance) {
  Ember.$(document).ajaxError((event, jqXHR) => {
    if (jqXHR.status === 401) {
      const sessionService = instance.container.lookup('service:session');
      if (sessionService.get('isAuthenticated')) {
        sessionService.invalidate();
      }
      window.location.replace('/sign-in');
    }
  });
}

export default {
  name: 'application-session-validation',
  after: 'application-session-service',
  initialize: initialize
};
