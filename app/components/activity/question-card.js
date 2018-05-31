import Ember from 'ember';
import TaxonomyTag from 'admin-dataview/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'admin-dataview/models/taxonomy/taxonomy-tag-data';
import {PLAYER_WINDOW_NAME, PLAYER_EVENT_SOURCE} from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activity-question-card'],

  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * question object
   * @type {Object}
   */
  question: null,

  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed(
    'question.standards.[]',
    function() {
      let standards = this.get('question.standards');
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    }
  ),

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    getQuestionInfo: function(question) {
      this.sendAction('getQuestionInfo', question);
    },

    onPlayQuestion(questionId) {
      let locOrigin = window.location.origin;
      let questionUrl = `/content/questions/play/${questionId}?source=${PLAYER_EVENT_SOURCE.RGO}`;
      let playerURL = locOrigin + questionUrl;
      window.open(playerURL, PLAYER_WINDOW_NAME);
    }

  }

});
