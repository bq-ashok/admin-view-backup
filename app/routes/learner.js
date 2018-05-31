import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:profile
   */
  profileService: Ember.inject.service('api-sdk/profile'),


  // --------------------------------------------------------------------------
  // Properties

  /**
   *  It will maintain the selected active duration from time period filter, by
   *  default it will be '3m'
   * @type {String}
   */
  selectedActiveDuration: '3m',

  //------------------------------------------------------------------------
  //Events

  actions: {
    onSelectActiveDuration: function(activeDuration) {
      this.set('selectedActiveDuration', activeDuration);
    }
  },

  //------------------------------------------------------------------------
  //Methods


  model: function(params) {
    return Ember.RSVP.hash({
      userProfile: this.get('profileService').getUserProfile(params.userId),
      userId: params.userId,
      selectedActiveDuration: this.get('selectedActiveDuration')
    });
  },

  setupController: function(controller, model) {
    controller.set('userId', model.userProfile.userId);
    controller.set('user', model.userProfile);
  }

});
