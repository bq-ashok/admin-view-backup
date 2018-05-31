import Ember from 'ember';
import TaxonomyTag from 'admin-dataview/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'admin-dataview/models/taxonomy/taxonomy-tag-data';
import { PLAYER_WINDOW_NAME, PLAYER_EVENT_SOURCE } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-collection-card'],

  // -------------------------------------------------------------------------
  // Events
  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * collection object
   * @type {Object}
   */
  collection: null,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('collection.standards.[]', function() {
    let standards = this.get('collection.standards');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  }),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * @function onShowPullOut
     * Action triggered when the user click on the play icon
     */
    onShowPullOut(collection) {
      let component = this;
      component.sendAction('onShowPullOut', collection);
    },

    /**
     * Action triggered when the user play collection
     * It'll open the player in new tab
     */
    onPlayCollection(collectionId) {
      let locOrigin = window.location.origin;
      let collectionUrl = `/player/${collectionId}?source=${PLAYER_EVENT_SOURCE.RGO}`;
      let playerURL = locOrigin + collectionUrl;
      window.open(playerURL, PLAYER_WINDOW_NAME);
    }
  }
});
