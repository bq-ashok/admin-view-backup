import Ember from 'ember';
import ConfigurationMixin from 'admin-dataview/mixins/configuration';

export default Ember.Controller.extend(ConfigurationMixin, {
  // --------------------------------------------------------------------------
  // Query params

  queryParams: ['access_token'],

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:session
   */
  session: Ember.inject.service('session'),
  /**
   * Authentication (api-sdk/authentication) service.
   * @property {AuthenticationService} authService
   * @readOnly
   */
  authenticationService: Ember.inject.service('api-sdk/authentication'),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    onMenuItemSelection(item) {
      if (item === 'competency') {
        this.transitionToRoute(`${item}.tree`);
      } else {
        this.transitionToRoute(item);
      }
    }
  }
});
