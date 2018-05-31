import Ember from 'ember';
import TaxonomyTag from 'admin-dataview/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'admin-dataview/models/taxonomy/taxonomy-tag-data';
import { PLAYER_WINDOW_NAME, PLAYER_EVENT_SOURCE } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-assessment-card'],

  // -------------------------------------------------------------------------
  // Events
  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },


  // -------------------------------------------------------------------------
  // Properties

  /**
   * assessment object
   * @type {Object}
   */
  assessment: null,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed(
    'assessment.standards.[]',
    function() {
      let standards = this.get('assessment.standards');
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  ),

  actions: {
    onShowPullOut: function(assessment) {
      this.sendAction('onShowPullOut', assessment);
    },

    /**
     * Action triggered when the user play collection
     * It'll open the player in new tab
     */
    onPlayAssessment(assessmentId) {
      let locOrigin = window.location.origin;
      let assessmentUrl = `/player/${assessmentId}?source=${PLAYER_EVENT_SOURCE.RGO}`;
      let playerURL = locOrigin + assessmentUrl;
      window.open(playerURL, PLAYER_WINDOW_NAME);
    }
  }

});
