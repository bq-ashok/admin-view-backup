import Ember from 'ember';
import ConfigurationMixin from 'admin-dataview/mixins/configuration';
import {
  COMPETENCY_NAVIGATION_MENUS,
  COMPETENCY_NAVIGATION_MENUS_INDEX
} from 'admin-dataview/config/config';
import Utils from 'admin-dataview/utils/utils';

/**
 * Competency menu navigation Tabs
 *
 * Component responsible for enabling more flexible navigation options for competency menu navigation.
 * For example, where {@link controllers/competency.js} allows access the competency information and navigate through the menu options.
 * @module
 * @see controllers/application.js
 * @augments ember/Component
 */
export default Ember.Component.extend(ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['competency-menu-navigation'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Triggered when an menu item is selected
     * @param item
     */
    onMenuItemSelection(item) {
      this.sendAction('onMenuItemSelection', item);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Navigation menu items
   * @property {Array}
   */
  menuItems: COMPETENCY_NAVIGATION_MENUS,

  /**
   * Find the active menu index from the navigation list.
   * @property {Boolean}
   */
  activeMenuIndex: Ember.computed(function() {
    let activeMenuIndex =
      COMPETENCY_NAVIGATION_MENUS_INDEX[Utils.getRoutePathLastOccurrence()];
    return activeMenuIndex > -1 ? activeMenuIndex : 0;
  })
});
