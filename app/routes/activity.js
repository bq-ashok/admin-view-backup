import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // -------------------------------------------------------------------------
  // Events

  model: function(params) {
    return params;
  },

  setupController: function(controller, model) {
    controller.set('searchTerm', model.term);
    controller.set('selectedFilterItems', controller.getStoredFilterItems());
  }
});
