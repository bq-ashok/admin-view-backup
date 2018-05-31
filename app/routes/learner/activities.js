import Ember from 'ember';

export default Ember.Route.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:learners
   */
  learnersService: Ember.inject.service('api-sdk/learners'),

  //-------------------------------------------------------------------------
  //Properties

  queryParams: {
    resource: {
      refreshModel: true
    }
  },

  //------------------------------------------------------------------------
  //Events

  model: function(params) {
    let route = this;
    let resource = params.resource;
    let learnerModel = this.modelFor('learner');
    let selectedActiveDuration= learnerModel.selectedActiveDuration;
    let userId = learnerModel.userId;
    return Ember.RSVP.hash({
      userTimeSpentStats: route.get('learnersService').getUserTimeSpentStats(userId, selectedActiveDuration),
      userId: userId,
      selectedActiveDuration: selectedActiveDuration,
      resource: resource
    });
  },

  setupController: function(controller, model) {
    controller.set('learnerActivities', model.userTimeSpentStats);
    controller.set('userId', model.userId);
    controller.set('selectedActiveDuration', model.selectedActiveDuration);
    controller.set('resource', model.resource);
  },

  //------------------------------------------------------------------------
  //Actions
  actions: {
    /**
     * @function afterRender
     * Event triggerred once the controller rendered successfully
     */
    afterRender: function(resource) {
      $(`.${resource} .pull-down`).click();
    }
  }
});
