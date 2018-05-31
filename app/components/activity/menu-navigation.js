import Ember from 'ember';
import {ACTIVITIES_NAVIGATION_MENUS,ACTIVITIES_NAVIGATION_MENUS_INDEX} from 'admin-dataview/config/config';
import Utils from 'admin-dataview/utils/utils';

/**
 * Activities search navigation Tabs
 *
 * Component responsible for enabling more flexible navigation options for Activities search.
 * For example, where {@link controllers/activity.js} allows access the Activities information and navigate through the menu options.
 * @module
 * @see controllers/activity.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-menu-navigation'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Triggered when an menu item is selected
     * @param item
     */
    onMenuItemSelection: function(item) {
      this.sendAction('onMenuItemSelection', item);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Activities navigation menu items
   * @property {Array}
   */
  menuItems: ACTIVITIES_NAVIGATION_MENUS,

  /**
  * Find the active menu index from the navigation list.
  * @property {Boolean}
  */
  activeMenuIndex: Ember.computed(function() {
    let activeMenuIndex = ACTIVITIES_NAVIGATION_MENUS_INDEX[Utils.getRoutePathLastOccurrence()];
    return activeMenuIndex > -1 ? activeMenuIndex : 0;
  })

});
