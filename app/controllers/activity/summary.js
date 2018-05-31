import Ember from 'ember';

export default Ember.Controller.extend({

  // -------------------------------------------------------------------------
  // Query

  queryParams: ['term'],

  // -------------------------------------------------------------------------
  // Properties

  term: '',

  /**
   * @property {Boolean}
   * Just a observer property to watch filter changes
   */
  onRefreshItems: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function refreshItems
   * Method to refresh search items
   */
  refreshItems() {
    let controller = this;
    controller.toggleProperty('onRefreshItems');
  }
});
