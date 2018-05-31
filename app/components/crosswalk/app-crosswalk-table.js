import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['app-crosswalk-table'],

  // -------------------------------------------------------------------------
  // Events
  didRender: function() {
    let component = this;
    component._super(...arguments);
    let numberOfColumns = component.get('tableData.header').length;
    component.$('.thead .td').css('width', `calc(100% / ${numberOfColumns})`);
    component.$('tbody tr td').css('width', `calc(100% / ${numberOfColumns})`);
    $('.table-structure').animate({ scrollTop: 0 });
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Move the scroll to top when user click up arrow
     */
    scrollTop: function() {
      let component = this;
      $('.crosswalk-body').animate({
        scrollTop: 0
      });
      component.sendAction('onToggleSubjectBrowser');
    },

    /**
     * Action triggered when the user select respective framework to search
     */
    onClickSearchIcon(frameworkId, headerPosition) {
      let component = this;
      let tableData = component.get('tableData');
      let crosswakCodeByFrameworkId = [];
      tableData.body.map(crosswalkItem => {
        let crosswalkCodeItem = crosswalkItem[headerPosition];
        if (crosswalkCodeItem !== '') {
          crosswakCodeByFrameworkId.push(crosswalkCodeItem);
        }
      });
      component.set('selectedFramework', frameworkId);
      component.set('crosswakCodeByFrameworkId', crosswakCodeByFrameworkId);
      component.set('isShowTableSearch', true);
    },

    /**
     * Action triggered when the user click back icon
     */
    onBackToCrosswalk() {
      let component = this;
      component.set('crosswakCodeByFrameworkId', null);
      component.set('isShowTableSearch', false);
    },

    /**
     * Action triggered when the user toggle micro-competency visibility
     */
    onToggleMicroCompetency() {
      let component = this;
      component.$('.micro-competency').toggleClass('hide-row');
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Show/Hide crosswalk table search
   */
  isShowTableSearch: false,

  /**
   * Currently selected frmework id
   */
  selectedFramework: null,

  /**
   * List of crosswalk codes by framework id
   */
  crosswakCodeByFrameworkId: null
});
