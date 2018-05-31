import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * Computed property to store pull out data contents
   */
  contents: Ember.computed('pullOutContents', function() {
    let component = this;
    let pullOutContents = component.get('pullOutContents');
    let contents = pullOutContents || [];
    return contents;
  }),

  /**
   * Computed property to handle shore more button visibility
   */
  isShowMoreVisible: Ember.computed('pullOutContents', function() {
    let component = this;
    let totalHitCount = component.get('pullOutInfo.totalHitCount');
    let fetchedCount = component.get('contents.length');
    return totalHitCount > fetchedCount;
  }),

  // Actions
  actions: {
    /**
     * Action triggered when the user click show more results button
     */
    onClickShowMoreResults() {
      let component = this;
      component.sendAction('onClickShowMoreResults');
    }
  }
});
