import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['search-filter-tag'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user click on the clear button in the applied filter item
     */
    onRemoveFilter(selectedTag) {
      let component = this;
      component.sendAction('onRemoveFilter', selectedTag);
    }
  }
});
