import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    onMenuItemSelection(item) {
      this.transitionTo(`competency.${  item}`);
    }
  }

});
