import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  //-------------------------------------------------------------------------
  //Properties


  // -------------------------------------------------------------------------
  // Actions


  // -------------------------------------------------------------------------
  // Methods

  model: function(params) {
    let term = params.term ? params.term : '';
    return {
      term: term
    };
  },


  setupController: function(controller, model) {
    //Set search tem only if available
    if ( model.term !== '') {
      controller.set('term', model.term);
    } else {
      //Show search results without query term
      controller.refreshItems();
    }
  }

});
