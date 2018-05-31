import Ember from 'ember';
import { truncateString } from 'admin-dataview/utils/utils';

export default Ember.Controller.extend({
  //------------------------------------------------------------------------
  //Dependencies

  /**
   * @requires service:crosswalk
   */
  crosswalkService: Ember.inject.service('api-sdk/crosswalk'),

  //------------------------------------------------------------------------
  //Properties

  /**
   * Property to handle enable/disable generate table button
   */
  enableGenerateTableBtn: false,

  /**
   * Property to handle show/hide crosswalk table
   */
  showCrosswalkTable: false,

  /**
   * Property to store list of selected frameworks
   */
  selectedFrameworks: [],

  /**
   * Property to store current subjectId
   */
  subjectId: null,

  /**
   * Property to store current categoryId
   */
  categoryId: 'k_12',

  /**
   * Property to store current subject title
   */
  subjectTitle: 'Math',

  /**
   * Property to store complete table data
   */
  tableData: [],

  /**
   * Show Subject - Framework browser seection
   * Toggle it if the crosswalk table visible
   */
  showSubjectBrowser: true,

  /**
   * Default crosswalk table header items
   */
  defaultTableHeaderItems: ['COMPETENCY'],

  /**
   * Show Loading spinner
   */
  isLoading: false,

  microComptencyLevelPattern: 'learning_target_level_',

  //------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when user select framework
     */
    frameworkStack(subjectId, frameworkId) {
      let controller = this;
      let frameworkStack = controller.get('selectedFrameworks');
      let frameworkPosition = frameworkStack.indexOf(frameworkId);
      if (frameworkStack.includes(frameworkId)) {
        frameworkStack.splice(frameworkPosition, 1);
      } else {
        frameworkStack.push(frameworkId);
      }
      controller.set('selectedFrameworks', frameworkStack);
      controller.set('subjectId', subjectId);
      controller.set('enableGenerateTableBtn', true);
      let numberOfItems = frameworkStack.length;
      if (numberOfItems < 1 || numberOfItems > 5) {
        controller.set('enableGenerateTableBtn', false);
      }
    },

    disableGenerateBtn(category, subject) {
      let controller = this;
      controller.set('categoryId', category);
      if (subject) {
        controller.set('subjectTitle', subject.subjectTitle);
        let currentSubjectId = controller.get('subjectId');
        if (subject.id !== currentSubjectId) {
          controller.set('selectedFrameworks', []);
          controller.set('enableGenerateTableBtn', false);
          controller.set('showCrosswalkTable', false);
        }
      }
    },

    /**
     * Action triggered when user click generate table button
     */
    generateCrosswalkTable() {
      let controller = this;
      let selectedFrameworks = controller.get('selectedFrameworks');
      let subjectId = controller.get('subjectId');
      controller.set('isLoading', true);
      let crosswalkDataPromise = Ember.RSVP.resolve(
        controller.get('crosswalkService').getCrosswalkData(subjectId)
      );
      return Ember.RSVP.hash({
        frameworkList: selectedFrameworks,
        crosswalkData: crosswalkDataPromise
      }).then(function(hash) {
        controller.updateCrosswalkTable(hash);
        return controller.set('showSubjectBrowser', false);
      });
    },

    onToggleSubjectBrowser() {
      let controller = this;
      controller.toggleProperty('showSubjectBrowser');
    }
  },

  /**
   * @param rawData of the crosswalk Data
   * Method to update the crosswalk table
   */
  updateCrosswalkTable(rawData) {
    let controller = this;
    let crosswalkData = rawData.crosswalkData;
    let frameworkList = rawData.frameworkList;
    let defaultHeaderItems = controller.get('defaultTableHeaderItems');
    let tableHeader = defaultHeaderItems.concat(frameworkList);
    let numberOfColumns = tableHeader.length;
    let tableBody = [];
    let microComptencyLevelPattern = controller.get(
      'microComptencyLevelPattern'
    );
    crosswalkData.map(data => {
      let tableRowData = [];
      let competencyLevel = data.code_type.includes(microComptencyLevelPattern)
        ? 'micro-competency hide-row'
        : 'competency';
      tableRowData.length = numberOfColumns;
      tableRowData.fill('');
      tableRowData.competencyType = competencyLevel;
      tableRowData[0] = {
        id: data.id,
        title: truncateString(data.title, 180)
      };
      data.crosswalkCodes.forEach(crosswalkCode => {
        let frameworkId = crosswalkCode.framework_id;
        let frameworkPosition = tableHeader.indexOf(frameworkId);
        if (frameworkList.includes(frameworkId)) {
          let tableCellData = {
            id: crosswalkCode.id,
            title: truncateString(crosswalkCode.title, 180)
          };
          tableRowData[frameworkPosition] = tableCellData;
        }
      });
      tableBody.push(tableRowData);
      return true;
    });
    let tableData = {
      header: tableHeader,
      body: tableBody
    };
    controller.set('tableData', tableData);
    controller.set('showCrosswalkTable', true);
    controller.set('isLoading', false);
  }
});
