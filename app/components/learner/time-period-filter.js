import Ember from 'ember';
import {LEARNER_TIME_PERIOD_FILTER} from 'admin-dataview/config/config';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['time-period-filter'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Triggered when an filter is selected
     * @param filter
     */
    onFilterSelection: function(filter) {
      this.set('selectedIndex', LEARNER_TIME_PERIOD_FILTER.indexOf(filter));
      this.sendAction('onFilterSelection', filter.value);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Filter period items
   * @property {Array}
   */
  filterItems: LEARNER_TIME_PERIOD_FILTER,

  /**
   * selected filter item index
   * @type {Number}
   */
  selectedIndex: 3

});
