import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user close prerequisites info popup
     */
    onCloseInfoPopup() {
      let component = this;
      component.sendAction('onCloseInfoPopup');
    },

    /**
     * Action triggered when the user select a prerequisitesId
     */
    onSelectPrerequisites(prerequisitesId) {
      let component = this;
      component.sendAction('onSelectPrerequisites', prerequisitesId);
    }
  }
});
