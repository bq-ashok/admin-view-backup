import Ember from 'ember';

/**
 * App icon
 * Wrapper for application icons, default implementation is material-design-icons from google
 * https://material.io/icons/
 * @see application.hbs
 *
 *
 * @module
 * @typedef {object} GruIcon
 */
export default Ember.Component.extend({


  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes
  attributeBindings: ['tooltipData:title','dataToggle:data-toggle'],

  classNames:['gru-icon', 'material-icons'],

  classNameBindings: [ 'name' ],

  tagName: 'i',

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Properties

  /**
   * Icon name
   * @property {string}
   */
  name: null,

  tooltipTitle: null,

  tooltipData: Ember.computed('tooltipTitle', function(){
    return this.get('tooltipTitle') ? this.get('i18n').t( this.get('tooltipTitle') ) : undefined;
  }),

  dataToggle: Ember.computed('tooltipTitle', function(){
    return this.get('tooltipTitle') ? 'tooltip' : undefined;
  })


  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods
});
