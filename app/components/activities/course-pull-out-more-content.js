import Ember from 'ember';
import { truncateString } from 'admin-dataview/utils/utils';

export default Ember.Component.extend({
  classNames: ['pull-out', 'course-pull-out-more-content'],

  // -------------------------------------------------------------------------
  // Properties

  groupData: null,

  /**
   * Grouping header indivituals  data to show more info
   */
  onChange: Ember.observer('groupHeader', function() {
    this.selectedHeadersData();
    return this.get('groupData');
  }),

  /**
   * Observe standars property
   */
  observeStandardsChange: Ember.observer('standards', function() {
    let component = this;
    let standardVisibleCount = component.get('standardVisibleCount');
    component.updateStandardsList(standardVisibleCount);
  }),

  /**
   * @property {Boolean}
   * Property to handle description show more/less
   */
  isShowMore: true,

  /**
   * @property {Number}
   * Property to store default standards visibility count
   */
  standardVisibleCount: 5,

  /**
   * @property {Array}
   * Property to store list of visible standards
   */
  visibleStandards: [],

  /**
   * @property {Boolean}
   * Property to handle list of standards visible
   */
  isShowAllStandards: false,

  /**
   * @property {Number}
   * Property to store number of standards are not visbile
   */
  nonVisbibleStandards: 0,

  // /**
  //  * Grouping header  by key value to show
  //  */
  selectedHeadersData() {
    let component = this;
    let iterateKeyValue = this.get('groupData');
    let setResponse = [];
    let color = '';
    const extracted = ['title', 'description'];
    const curated = [
      'Publisher',
      'Publish Status',
      'Aggregator',
      'Host',
      'License',
      'Keywords',
      'Visibility'
    ];
    const tagged = [
      'Audience',
      'subject',
      'Course',
      'domain',
      'Standards',
      'Depth of Knowledge',
      '21st Century Skills'
    ];
    const computed = [
      'Created On',
      'Modified On',
      'Modified By',
      'relevance',
      'engagment',
      'efficacy'
    ];

    let headersEnabled = Ember.A();
    headersEnabled = this.get('groupHeader');
    if (iterateKeyValue.creation) {
      for (var key in iterateKeyValue) {
        if (iterateKeyValue[key]) {
          let valueObject = [];
          for (var itemkey in iterateKeyValue[key]) {
            let samples = new Object();
            let selectType;
            samples = iterateKeyValue[key];
            if (extracted.indexOf(itemkey) !== -1) {
              headersEnabled.forEach(data => {
                if (data.header === 'extracted') {
                  selectType = data.isEnabled;
                }
              });
              color = '#1aa9eb';
            } else if (curated.indexOf(itemkey) !== -1) {
              headersEnabled.forEach(data => {
                if (data.header === 'curated') {
                  selectType = data.isEnabled;
                }
              });
              color = '#3b802c';
            } else if (computed.indexOf(itemkey) !== -1) {
              headersEnabled.forEach(data => {
                if (data.header === 'computed') {
                  selectType = data.isEnabled;
                }
              });
              color = '#303a42';
            } else if (tagged.indexOf(itemkey) !== -1) {
              headersEnabled.forEach(data => {
                if (data.header === 'tagged') {
                  selectType = data.isEnabled;
                }
              });
              color = '#ed842a';
            }
            let value = {
              key: itemkey,
              value: samples[itemkey],
              color: color
            };
            if (selectType) {
              valueObject.push(value);
            }
          }
          let response = {
            key: key,
            value: valueObject,
            length: valueObject.length
          };
          setResponse.push(response);
        }
      }
    }
    component.set('selectedDatas', setResponse);
    return setResponse;
  },

  /**
   * @function updateStandardsList
   * Method to update visible standards list
   */
  updateStandardsList(visibilityCount) {
    let component = this;
    let standards = component.get('standards');
    let visibleStandards = [];
    standards.some(function(standard) {
      visibleStandards.push(standard.id);
      return visibleStandards.length === visibilityCount;
    });
    component.set('nonVisbibleStandards', standards.length - visibleStandards.length);
    component.set('visibleStandards', visibleStandards);
  },

  // -------------------------------------------------------------------------
  // actions

  actions: {
    onheaderClick(header) {
      let datas = Ember.A();
      datas = this.get('groupHeader');
      datas.forEach(data => {
        if (data.header === header.header) {
          data.set('isEnabled', !header.isEnabled);
        }
      });
      this.selectedHeadersData();
    },

    onShowMore(description) {
      let component = this;
      let isShowMore = component.get('isShowMore');
      let descriptionToShow = isShowMore
        ? description
        : truncateString(description);
      component.$('.description .text').html(descriptionToShow);
      component.toggleProperty('isShowMore');
    },

    /**
     * Action triggered when the user click show more/less in the framework standards
     */
    onClickShowMoreStandards() {
      let component = this;
      let isShowAllStandards = component.get('isShowAllStandards');
      let defaultVisibilityCount = component.get('standardVisibleCount');
      let noOfStandardsToShow = isShowAllStandards ? defaultVisibilityCount : component.get('standards.length');
      component.updateStandardsList(noOfStandardsToShow);
      component.toggleProperty('isShowAllStandards');
    }
  }
});
