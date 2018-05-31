import Ember from 'ember';
import TaxonomyTag from 'admin-dataview/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'admin-dataview/models/taxonomy/taxonomy-tag-data';
import { PLAYER_EVENT_SOURCE, PLAYER_WINDOW_NAME } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-resource-card'],

  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * resource object
   * @type {Object}
   */
  resource: null,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('resource.standards.[]', function() {
    let standards = this.get('resource.standards');
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
    getResourceInfo: function(resource) {
      this.sendAction('getResourceInfo', resource);
    },

    /**
     * Action triggered when the user play a resource
     */
    onPlayResource(resourceId) {
      let locOrigin = window.location.origin;
      let resourceUrl = `/content/resources/play/${resourceId}?source=${PLAYER_EVENT_SOURCE.RGO}`;
      let playerURL = locOrigin + resourceUrl;
      window.open(playerURL, PLAYER_WINDOW_NAME);
    }
  }
});
