import Ember from 'ember';
import {NAVIGATION_MENUS} from 'admin-dataview/config/config';

/**
 * Subject competency Tabs
 *
 * Component responsible for enabling more flexible navigation options for competency subject grid.
 * For example, where {@link controllers/application.js} allows access the RGO information and navigate through the menu options.
 * @module
 * @see controllers/application.js
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['app-navigation'],

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
   * Navigation menu items
   * @property {Array}
   */
  menuItems: NAVIGATION_MENUS,

  /**
  * Find the active menu index from the navigation list.
  * @property {Boolean}
  */
  activeMenuIndex: Ember.computed(function() {
    let activeMenuIndex = NAVIGATION_MENUS;
    return activeMenuIndex > -1 ? activeMenuIndex : 0;
  })

});
