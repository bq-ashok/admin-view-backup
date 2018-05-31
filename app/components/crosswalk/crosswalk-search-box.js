import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['crosswalk-search-box'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * Action triggered when the user type a key on the input box
     */
    onSearchCrosswalk() {
      let component = this;
      let searchInput = component.get('search');
      component.sendAction('onSearchCrosswalk', searchInput);
    },

    /**
     * Action triggered when the user click the back icon
     */
    onBackToCrosswalk() {
      let component = this;
      component.sendAction('onBackToCrosswalk');
    }
  },

  // -------------------------------------------------------------------------
  // Events
  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  }
});
