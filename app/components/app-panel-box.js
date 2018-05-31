import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['app-panel-box'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Title of the panel
   */
  title: null,

  /**
   * Localize title of the panel
   */
  localizeTitle: null,

  /**
   * Indicates back button need to show or not
   * @type {Boolean}
   */
  showBackButton: false,

  // -------------------------------------------------------------------------
  // Events

  actions: {
    onClickBackButton() {
      this.sendAction('onClickBackButton');
    }
  }
});
