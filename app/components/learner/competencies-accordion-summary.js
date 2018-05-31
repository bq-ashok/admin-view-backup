import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:competency
   */
  competencyService: Ember.inject.service('api-sdk/competency'),


  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['competencies-accordion-summary'],

  classNameBindings: ['isExpanded:expanded'],

  // -------------------------------------------------------------------------
  // Properties


  /**
   * competency
   * @return {Object}
   */
  competency: null,

  /**
   * user id
   * @type {String}
   */
  userId: null,

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     *
     * Triggered when an menu item is selected
     * @param item
     */
    selectCompetency: function(competency) {
      let component = this;
      component.set('isLoading', true);
      let userId = component.get('userId');
      return Ember.RSVP.hash({
        collections: component.get('competencyService').getUserPerformanceCompetencyCollections(userId, competency.get('competencyCode'))
      }).then(({
        collections
      }) => {
        component.set('isLoading', false);
        component.set('collections', collections);

      });
    }
  }

  // -------------------------------------------------------------------------
  // Events

});
