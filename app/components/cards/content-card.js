import Ember from 'ember';
import TaxonomyTag from 'admin-dataview/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'admin-dataview/models/taxonomy/taxonomy-tag-data';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content-card'],

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('content.standards.[]', function() {
    var standards = this.get('content.standards');
    if (standards) {
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
    }
    return TaxonomyTag.getTaxonomyTags(standards);
  }),

  /**
   * isCollection card
   */
  isCollection: Ember.computed.equal('content.type', 'collection'),

  /**
   * isAssessment card
   */
  isAssessment: Ember.computed.equal('content.type', 'assessment'),

  /**
   * isResource card
   */
  isResource: Ember.computed.equal('content.type', 'resource'),

  /**
   * isQuestion card
   */
  isQuestion: Ember.computed.equal('content.type', 'question'),

  /**
   * isCourse card
   */
  isCourse: Ember.computed.equal('content.type', 'course'),

  // -------------------------------------------------------------------------
  // Events
  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  }
});
