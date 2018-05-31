import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * Session Service
   */
  session: Ember.inject.service('session'),

  //-------------------------------------------------------------------------
  //Properties

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Methods

  setupController: function(controller) {
    let route = this;
    let userId = route.get('session.id');
    let userFilterItems = JSON.parse(
      localStorage.getItem(`research_${userId}_activities_filters`)
    );
    controller.set('selectedFilterItems', userFilterItems);
    controller.set('appliedFilterList', controller.getUserAppliedFilters());
    //redirect into the summary page, if user have selected category and subject filters
    if (
      userFilterItems &&
      userFilterItems.category &&
      userFilterItems.subject &&
      userFilterItems.subject.length > 0
    ) {
      route.transitionTo('/activities/summary');
    }
  }
});
