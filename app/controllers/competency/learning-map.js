import Ember from 'ember';
import {
  LEARNING_MAP_DEFAULT_LEVELS,
  LEARNING_MAP_CONTENT_SEQUENCE,
  CONTENT_TYPES
} from 'admin-dataview/config/config';

export default Ember.Controller.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @requires searchService
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * @requires il8n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Events

  /**
   * observer to check newly fetched competencies
   */
  observeFetchedCompetency: Ember.observer('fetchedCompetencies', function() {
    let controller = this;
    let competencies = controller.get('fetchedCompetencies');
    let renderedTable = controller.get('tableBody');
    let tableBody = [];
    let microComptencyLevelPattern = controller.get(
      'microComptencyLevelPattern'
    );
    competencies.map(competency => {
      let competencyLevel = competency.type.includes(microComptencyLevelPattern)
        ? 'micro-competency'
        : 'competency';
      let tableRow = {
        id: competency.id,
        title: competency.title,
        contentCounts: controller.getStructuredContentCount(
          competency.contentCounts
        ),
        prerequisites: competency.prerequisites,
        competencyLevel: competencyLevel
      };
      tableBody.push(tableRow);
    });
    controller.set('tableBody', renderedTable.concat(tableBody));
    controller.set('isLoading', false);
    Ember.$('.browser-container').hide();
  }),

  /**
   * Initally load the learning map competency table
   */
  init() {
    let controller = this;
    controller.fetchLearningMapCompetency();
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user click on the Export button
     */
    onExportCompetency() {
      let controller = this;
      controller.resetTable();
      controller.fetchLearningMapCompetency();
      Ember.$('.table-container').show();
    },

    /**
     * Action triggered when the user clic on a new item from the browser
     */
    onSelectDataItem(type, dataItem) {
      let controller = this;
      Ember.$('.table-container').hide();
      if (type !== 'domain') {
        controller.updateDataLevel(type, dataItem);
      }
    },

    /**
     * Action triggered when the user select domain items
     */
    onSelectDomain(domainStack) {
      let controller = this;
      controller.set('isShowExportBtn', true);
      controller.set('dataLevels.domainCode', domainStack.toString());
      controller.set('selectedDataLevelItems.domain', domainStack.length);
      controller.set('domainStack', domainStack);
      Ember.$('.table-container').hide();
    },

    /**
     * Action triggered when there is no competencies
     */
    onToggleExportButton(state) {
      let controller = this;
      controller.set('isShowExportBtn', state);
    },

    /**
     * Action triggered when the user click on the content type
     */
    onSelectContentType(competencyId, contentType) {
      let controller = this;
      controller.resetPullOutData();
      controller.set('pullOutShowMore', true);
      controller.set('selectedCompetency', competencyId);
      controller.set('selectedContentType', contentType);
      controller.getLearningMapCompetencyData();
    },

    /**
     * Action triggered when the user click show more results
     */
    onClickShowMoreResults() {
      let controller = this;
      controller.set('pullOutShowMore', false);
      controller.getLearningMapCompetencyData();
    },

    onSearch(searchTerm) {
      let controller = this;
      controller.resetTable();
      controller.set('searchTerm', searchTerm);
      controller.fetchLeaningMapSearchComptency();
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function fetchLearningMapCompetency
   * Method to fetch learning map competency list
   */
  fetchLearningMapCompetency() {
    let controller = this;
    if (!controller.get('isProcessedAllCompetency')) {
      controller.set('isLoading', true);
      let dataLevels = controller.get('dataLevels');
      let start = controller.get('start');
      let length = controller.get('length');
      let filters = Object.assign(dataLevels);
      let competencyPromise = Ember.RSVP.resolve(
        controller
          .get('searchService')
          .fetchLearningMapCompetency(filters, start, length)
      );
      return Ember.RSVP.hash({
        competencyList: competencyPromise
      }).then(function(hash) {
        let competencies = controller.get('competencies');
        let fetchedCompetencies = hash.competencyList.competencyInfo;
        let totalHitCount = hash.competencyList.totalHitCount;
        competencies = competencies.concat(fetchedCompetencies);
        controller.set('fetchedCompetencies', fetchedCompetencies);
        controller.set('competencies', competencies);
        controller.set('start', competencies.length);
        if (competencies.length >= totalHitCount) {
          controller.set('isShowExportBtn', false);
          controller.set('isProcessedAllCompetency', true);
        }
      });
    }
  },

  /**
   * @function fetchLearningMapContent
   * Function to fetch a competency content
   */
  fetchCompetencyContentById(competencyId) {
    let controller = this;
    let length = controller.get('competencyPullOutLength');
    let start = controller.get('competencyPullOutOffset');
    let filters = {
      id: competencyId
    };
    let competencyPromise = Ember.RSVP.resolve(
      controller
        .get('searchService')
        .learningMapsContent(filters, length, start)
    );
    return Ember.RSVP.hash({
      competencyInfo: competencyPromise
    }).then(function(hash) {
      return hash.competencyInfo;
    });
  },

  /**
   * @function getLearningMapCompetencyData
   * Method to request and process competency data
   */
  getLearningMapCompetencyData() {
    let controller = this;
    controller.set('isLoading', true);
    let competencyId = controller.get('selectedCompetency');
    let contentType = controller.get('selectedContentType');
    controller
      .fetchCompetencyContentById(competencyId)
      .then(function(learningMapData) {
        let pullOutContents = controller.get('pullOutContents');
        let fetchedPullOutData = controller.getLearningMapDataByContentType(
          learningMapData,
          contentType
        );
        pullOutContents = pullOutContents.concat(fetchedPullOutData.contents);
        controller.set('competencyPullOutOffset', pullOutContents.length);
        controller.set('pullOutContents', pullOutContents);
        controller.set('pullOutInfo', fetchedPullOutData);
        controller.set('showPullOut', true);
        controller.set('isLoading', false);
      });
  },

  /**
   * @function fetchLeaningMapSearchComptency
   * Method to search competencies based on search term
   */
  fetchLeaningMapSearchComptency() {
    let controller = this;
    controller.set('isLoading', true);
    let searchTerm = controller.get('searchTerm');
    let competencyPromise = Ember.RSVP.resolve(controller.get('searchService').searchLearningMapCompetency(searchTerm));
    return Ember.RSVP.hash({
      competencyList: competencyPromise
    }).then(function(hash) {
      let fetchedCompetencies = hash.competencyList.competencyInfo;
      let totalHitCount = hash.competencyList.totalHitCount;
      controller.set('fetchedCompetencies', fetchedCompetencies);
      controller.set('competencies', fetchedCompetencies);
      controller.set('isLoading', false);
      if (fetchedCompetencies.length >= totalHitCount) {
        controller.set('isShowExportBtn', false);
        controller.set('isProcessedAllCompetency', true);
      }
    }, function() {
      controller.set('isLoading', false);
    });
  },

  /**
   * @function getStructuredContentCount
   * Method to structurize content count of each competency
   */
  getStructuredContentCount(contentCounts) {
    let controller = this;
    let contentSequence = controller.get('contentSequence');
    let structuredContentCount = [];
    contentSequence.map(sequence => {
      let contentCount = {
        type: sequence,
        count: contentCounts[`${sequence}`]
      };
      structuredContentCount.push(contentCount);
    });
    return structuredContentCount;
  },

  /**
   * @function resetTable
   * Method to reset table content
   */
  resetTable() {
    let controller = this;
    let emptyItem = [];
    controller.set('start', 0);
    controller.set('competencies', emptyItem);
    controller.set('fetchedCompetencies', emptyItem);
    controller.set('tableBody', emptyItem);
    controller.set('isProcessedAllCompetency', false);
    controller.set('searchTerm', null);
  },

  /**
   * @function resetPullOutData
   * Method to reset competency pull out info
   */
  resetPullOutData() {
    let controller = this;
    controller.set('pullOutInfo', []);
    controller.set('pullOutContents', []);
    controller.set('competencyPullOutOffset', 0);
    controller.set('pullOutShowMore', true);
    controller.set('showPullOut', false);
  },

  /**
   * @function updateDataLevel
   * Method to update data level, when the user select an item from the browser
   */
  updateDataLevel(type, dataItem) {
    let controller = this;
    let dataLevels = controller.get('dataLevels');
    let isShowExportBtn = false;
    switch (type) {
    case 'category':
      dataLevels.subjectClassification = dataItem.value;
      dataLevels.subjectCode = '';
      dataLevels.courseCode = '';
      dataLevels.domainCode = '';
      controller.set(
        'selectedDataLevelItems.category',
        String(controller.get('i18n').t(dataItem.label))
      );
      break;
    case 'subject':
      dataLevels.subjectCode = dataItem.id;
      dataLevels.courseCode = '';
      dataLevels.domainCode = '';
      controller.set('selectedDataLevelItems.subject', dataItem.title);
      break;
    case 'course':
      dataLevels.courseCode = dataItem.id;
      dataLevels.domainCode = '';
      isShowExportBtn = true;
      controller.set('selectedDataLevelItems.course', dataItem.title);
      controller.set('selectedDataLevelItems.domain', null);
      break;
    }
    controller.set('isShowExportBtn', isShowExportBtn);
    controller.set('dataLevels', dataLevels);
  },

  /**
   * @function getLearningMapDataByContentType
   * Method to fetch user selected content type info
   */
  getLearningMapDataByContentType(learningMapData, contentType) {
    let controller = this;
    let contentTypes = controller.get('contentTypes');
    let selectedLearningMapData = {
      id: learningMapData.gutCode,
      displayCode: learningMapData.code,
      title: learningMapData.title,
      type: contentType,
      subject: learningMapData.subject,
      course: learningMapData.course,
      domain: learningMapData.domain
    };
    let contentData = [];
    if (contentTypes[`${contentType.toUpperCase()}`]) {
      let contentInfo = learningMapData.contents[`${contentType}`];
      contentData = {
        contents: learningMapData.learningMapsContent[`${contentType}`],
        totalHitCount: contentInfo.totalHitCount
      };
    } else {
      if (contentType === 'signatureCollection') {
        contentData = {
          contents: learningMapData.signatureContents.collections,
          totalHitCount: learningMapData.signatureContents.collections.length
        };
      } else if (contentType === 'signatureAssessment') {
        contentData = {
          contents: learningMapData.signatureContents.assessments,
          totalHitCount: learningMapData.signatureContents.assessments.length
        };
      }
    }
    selectedLearningMapData = Object.assign(
      selectedLearningMapData,
      contentData
    );
    return selectedLearningMapData;
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Boolean}
   * Property to show/hide export button
   */
  isShowExportBtn: true,

  /**
   * @property {JSON}
   * Property to store user selected data level item and it's used for applying filters
   */
  dataLevels: LEARNING_MAP_DEFAULT_LEVELS,

  defaultLevels: {
    subjectClassification: 'k_12',
    subjectCode: 'K12.SC',
    courseCode: 'K12.SC-SCK'
  },

  /**
   * @property {Array}
   * Property to store currently fetched competencies list
   */
  fetchedCompetencies: [],

  /**
   * @property {Array}
   * Property to store generated table body
   */
  tableBody: [],

  /**
   * @property {Array}
   * Property to store sequence of content items to show
   */
  contentSequence: LEARNING_MAP_CONTENT_SEQUENCE,

  /**
   * @property {Array}
   * Property to store selected domain stack
   */
  domainStack: [],

  /**
   * @property {Array}
   * Property to store list of competencies
   */
  competencies: [],

  /**
   * @property {Number}
   * Property to current start value
   */
  start: 0,

  /**
   * @property {Number}
   * Property to store length value
   */
  length: 500,

  /**
   * @property {Boolean}
   * Property to show/hide spinner
   */
  isLoading: false,

  /**
   * @property {JSON}
   * Property to store selected data leve items
   */
  selectedDataLevelItems: {
    category: 'K-12',
    subject: 'Math',
    course: 'Grade 6'
  },

  /**
   * @property {String}
   * Property to store the micro-competency pattern
   */
  microComptencyLevelPattern: 'learning_target_level_',

  /**
   * @property {Boolean}
   * To store flag, whether all the competencies are fetched or not
   */
  isProcessedAllCompetency: false,

  /**
   * @property {Boolean}
   * Show pullout
   */
  showPullOut: false,

  /**
   * @property {Array}
   * Property to store user selected competency
   */
  selectedCompetency: null,

  /**
   * @property {String}
   * Property to store user selected content type
   */
  selectedContentType: null,

  /**
   * @property {JSON}
   * Property to store default content types
   */
  contentTypes: CONTENT_TYPES,

  /**
   * @property {Number}
   * Property to store the API length
   */
  competencyPullOutLength: 9,

  /**
   * @property {Number}
   * Property to store current API offset
   */
  competencyPullOutOffset: 0,

  /**
   * @property {Array}
   * Property to store fetched pull out contents
   */
  pullOutContents: [],

  /**
   * @property {Array}
   * Property to store fetched pull out info
   */
  pullOutInfo: []
});
