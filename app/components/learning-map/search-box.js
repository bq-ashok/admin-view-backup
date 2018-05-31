import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['learning-map-search-box'],

  actions: {
    searchTerm() {
      var tempTerm = $.trim(this.get('tempTerm'));
      var term = $.trim(this.get('term'));
      var isEmptyTerm = tempTerm === '' && term !== '';
      var isIncorrectTermSize = this.get('isIncorrectTermSize');
      if (!isIncorrectTermSize || isEmptyTerm) {
        this.set('term', tempTerm);
        this.set('isInvalidSearchTerm', false);
        this.sendAction('onSearch', this.get('term'));
      } else {
        this.set('term', term);
        this.sendAction('searchStatus');
      }
    },

    inputValueChange() {
      this.set('isTyping', false);
    }
  },

  /**
   * Validate if the property term has the correct number of characters
   * @property
   */
  isIncorrectTermSize: Ember.computed('tempTerm', function() {
    var term = $.trim(this.get('tempTerm'));
    return !term || term.length < 3;
  }),

  /**
   * @property {?string} action to send up when searching for a term
   */
  onSearch: null,

  /**
   * Search term
   * @property {string}
   */
  term: null,

  /**
   * isTyping
   * @property {Boolean}
   */
  isTyping: null,

  isInvalidSearchTerm: false,

  tempTerm: Ember.computed.oneWay('term')
});
