import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:learners
   */
  learnersService: Ember.inject.service('api-sdk/learners'),

  //-------------------------------------------------------------------------
  //Properties

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    return Ember.RSVP.hash({
      learnersProfileDistribution: this.get('learnersService').getLearnerProfileDistribution(),
      learnerUserProfiles: this.get('learnersService').getLearnerUserProfiles()
    });
  },

  setupController: function(controller, model) {
    controller.set('learnerUserProfiles', model.learnerUserProfiles);
    controller.set('learnersProfileDistribution', model.learnersProfileDistribution);
  }

});
