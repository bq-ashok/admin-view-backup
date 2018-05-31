import Ember from 'ember';

/**
 * Explore button
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['explore-button'],

  actions: {
    onClickExploreButton: function(routeTo) {
      let component = this;
      component.sendAction('onClickExploreButton', routeTo);
    }
  }


});
