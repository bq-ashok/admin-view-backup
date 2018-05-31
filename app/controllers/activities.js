import Ember from 'ember';
import {
  DEFAULT_ACTIVITY_FILTERS,
  ACTIVITIES_NAVIGATION_MENUS_INDEX
} from 'admin-dataview/config/config';
import Utils from 'admin-dataview/utils/utils';

export default Ember.Controller.extend({
  activityController: Ember.inject.controller('activity'),

  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Search term clear refresh
   * @type {String}
   */
  toggleClearSearch: false,

  /**
   * @type {Boolean}
   * Show/Hide clear filter text
   */
  isEmptyFilters: false,

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * @function onSearch
     * Action triggered when the user hit enter on the search box
     */
    onSearch(term) {
      let controller = this;
      controller.transitionToRoute(`/activities/summary?term=${term}`);
    },

    onChangeFilterItems(selectedFilterItems) {
      let controller = this;
      controller.set('selectedFilterItems', selectedFilterItems);
      controller.set('appliedFilterList', controller.getUserAppliedFilters());
    },

    clearFilter() {
      let controller = this;
      let toggleClearSearch = controller.get('toggleClearSearch');
      let userId = controller.get('session.id');
      localStorage.setItem(
        `research_${userId}_activities_filters`,
        JSON.stringify({})
      );
      controller.set('selectedFilterItemsBuffer', {});
      let routeName = Utils.getRoutePathLastOccurrence();
      let activeMenuIndex = ACTIVITIES_NAVIGATION_MENUS_INDEX[routeName];
      controller.set('selectedFilterItems', {});
      controller.set('appliedFilterList', controller.getUserAppliedFilters());
      controller.set('toggleClearSearch', !toggleClearSearch);
      if (activeMenuIndex > -1) {
        controller.get(`${routeName}Controller`).refreshItems();
      }
    },

    clearSearchText() {
      let controller = this;
      let userId = controller.get('session.id');
      let filters = JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      );
      if (filters && (filters.category || filters.subject || filters.course)) {
        let url = window.location.href;
        let urlsplitted = url.split('?')[0];
        if (urlsplitted) {
          let lastURLdata = urlsplitted.split('/');
          let colelctionURL = lastURLdata[lastURLdata.length - 1];
          controller.set('searchTerm', '');
          controller.transitionToRoute(`/activities/${colelctionURL}`);
        } else {
          controller.transitionToRoute('/activities');
        }
      } else {
        controller.transitionToRoute('/activities');
      }
    },

    /**
     * Action triggered when am user change filter item
     */
    onEmptyFilters(isEmpty) {
      let controller = this;
      controller.set('isEmptyFilters', isEmpty);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Array}
   * List of filter items supported in the activities modules
   */
  filterTypes: DEFAULT_ACTIVITY_FILTERS,

  getUserAppliedFilters() {
    let controller = this;
    return controller.get('activityController').getAppliedFilters();
  }
});
