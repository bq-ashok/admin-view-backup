import Ember from 'ember';
import {
  TAXONOMY_CATEGORIES,
  ACTIVITIES_NAVIGATION_MENUS_INDEX,
  QUESTION_TYPE_CONFIG,
  RESOURCE_TYPE_CONFIG
} from 'admin-dataview/config/config';
import Utils from 'admin-dataview/utils/utils';
import ModalMixin from 'admin-dataview/mixins/modal';

export default Ember.Component.extend(ModalMixin, {
  //------------------------------------------------------------------------
  //Attributes
  classNames: ['activities-filter-accordion'],

  classNameBindings: ['isExpanded:expanded:collapsed'],

  //------------------------------------------------------------------------
  //Dependencies
  i18n: Ember.inject.service(),

  /**
   * taxonomyService to fetch taxonomy informations
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  /**
   * lookupService to fetch filter items
   */
  lookupService: Ember.inject.service('api-sdk/lookup'),

  profileService: Ember.inject.service('api-sdk/profile'),

  /**
   * session service to fetch current user information
   */
  session: Ember.inject.service('session'),

  //------------------------------------------------------------------------
  //Properties

  /**
   * @type {Number}
   * Number of filter items applied in this filter type
   */
  filterCount: Ember.computed('selectedFilterItems', function() {
    let component = this;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let filterCode = component.get('filterType.code');
    let curFilterItem = selectedFilterItems[`${filterCode}`];
    return curFilterItem && curFilterItem.length > 0 ? curFilterItem.length : 0;
  }),

  /**
   * @property {Boolean}
   * Toggle current component view
   */
  isExpanded: Ember.computed('filterType', function() {
    let component = this;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let filterType = component.get('filterType');
    let curFilterItems = selectedFilterItems[`${filterType.code}`];
    if (curFilterItems && curFilterItems.length > 0) {
      return true;
    }
    return false;
  }),

  /**
   * @property {Array}
   * List of items available in the filter type
   */
  filterList: null,

  /**
   * @property {String}
   * Default framework
   */
  defaultFrameworkId: 'GDT',

  /**
   * @property {Boolean}
   * determinate whether the user have toggle the expanded/collapsed view
   */
  isToggleExpanded: false,

  //------------------------------------------------------------------------
  //Events
  didInsertElement() {
    let component = this;
    let filterType = component.get('filterType');
    if (component.get('isExpanded')) {
      component.fetchMethodByType(filterType.code);
    }
  },

  //------------------------------------------------------------------------
  //Actions
  actions: {
    /**
     * Action triggered when the user toggle the expanded/collapsed view
     */
    onToggleExpandedView(filterType) {
      let component = this;
      let filter = filterType || component.get('filterType');
      if (!component.get('isExpanded')) {
        component.set('isToggleExpanded', true);
        component.fetchMethodByType(filter);
      }
      component.set('isToggleExpanded', false);
      component.toggleProperty('isExpanded');
    },

    /**
     * Action triggered when the user click on the checkbox
     */
    onClickCheckbox(filterInfo, filterType) {
      let component = this;
      component.sendAction('onClickCheckbox', filterInfo, filterType);
      let routeName = Utils.getRoutePathLastOccurrence();
      let activeMenuIndex = ACTIVITIES_NAVIGATION_MENUS_INDEX[routeName];
      //Route to summary page once the user select a subject from filter
      if (filterType === 'subject' && activeMenuIndex === undefined) {
        component.get('router').transitionTo('/activities/summary');
      }
    }
  },

  //------------------------------------------------------------------------
  //Methods

  /**
   * @function fetchMethodByType
   * Method to determinate which API should call based on the user selected filter type
   */
  fetchMethodByType(filterType) {
    let component = this;
    switch (filterType) {
    case 'category':
      component.fetchCategoryFilters();
      break;
    case 'subject':
      component.fetchSubjectFilters();
      break;
    case 'course':
      component.fetchCourseFilters();
      break;
    case 'audience':
      component.fetchAudienceFilters();
      break;
    case '21-century-skills':
      component.fetchCenturySkillFilters();
      break;
    case 'licenses':
      component.fetchLicenses();
      break;
    case 'dok':
      component.fetchDok();
      break;
    case 'publisher':
      component.fetchPublisherFilters();
      break;
    case 'qt':
      component.fetchQuestionTypeFilters();
      break;
    case 'rt':
      component.fetchResourceTypeFilters();
      break;
    default:
    }
  },

  /**
   * @function isFilterSelected
   * Method to make validate whether the checkbox is already selected or not
   */
  isFilterSelected(textToValidate, filterItems) {
    let isFilterAvailable = false;
    filterItems.map(item => {
      if (textToValidate === item.id) {
        isFilterAvailable = true;
      }
    });
    return isFilterAvailable;
  },

  /**
   * @function fetchCategoryFilters
   * Method to fetch category filter items
   */
  fetchCategoryFilters() {
    let component = this;
    let taxonomyCategories = TAXONOMY_CATEGORIES;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let filterList = [];
    const i18n = component.get('i18n');
    taxonomyCategories.map(category => {
      let categoryInfo = {
        label: String(i18n.t(category.label)),
        code: category.value,
        value: category.value
      };
      if (
        selectedFilterItems.category !== undefined &&
        selectedFilterItems.category.length > 0
      ) {
        let selectedCategory = selectedFilterItems.category[0];
        categoryInfo.checked = category.value === selectedCategory.id;
      }
      filterList.push(categoryInfo);
    });
    component.set('filterList', filterList);
  },

  /**
   * @function fetchSubjectFilters
   * Method to fetch subject filter items
   */
  fetchSubjectFilters() {
    let component = this;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let selectedCategory = selectedFilterItems.category;
    if (selectedCategory) {
      selectedCategory = selectedCategory[0];
      let filterList = [];
      let subjectsPromise = Ember.RSVP.resolve(
        component.get('taxonomyService').getSubjects(selectedCategory.id)
      );
      return Ember.RSVP.hash({
        subjectList: subjectsPromise
      }).then(function(hash) {
        hash.subjectList.map(subject => {
          let subjectInfo = {
            label: subject.title,
            code: subject.code,
            value: subject
          };
          if (
            selectedFilterItems.subject !== undefined &&
            selectedFilterItems.subject.length > 0
          ) {
            let selectedSubject = selectedFilterItems.subject[0];
            subjectInfo.checked = subject.code === selectedSubject.id;
          }
          filterList.push(subjectInfo);
        });
        component.set('filterList', filterList);
      });
    }
  },

  /**
   * @function fetchCourseFilters
   * Method to fetch course filter items
   */
  fetchCourseFilters() {
    let component = this;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let selectedSubjects = selectedFilterItems.subject;
    let filterList = [];
    if (selectedSubjects) {
      selectedSubjects = selectedSubjects[0];
      if (!selectedSubjects.frameworkId) {
        selectedSubjects.frameworkId = component.get('defaultFrameworkId');
      }
      let coursePromise = Ember.RSVP.resolve(
        component.get('taxonomyService').getCoursesBySubject(selectedSubjects)
      );
      return Ember.RSVP.hash({
        courseList: coursePromise
      }).then(function(hash) {
        hash.courseList.map(course => {
          let courseInfo = {
            label: course.title,
            code: course.code,
            value: course.id
          };
          if (
            selectedFilterItems.course !== undefined &&
            selectedFilterItems.course.length > 0
          ) {
            courseInfo.checked = component.isFilterSelected(
              course.code,
              selectedFilterItems.course
            );
          }
          filterList.push(courseInfo);
        });
        component.set('filterList', filterList);
      });
    }
  },

  /**
   * @function fetchAudienceFilters
   * Method to fetch audience filter items
   */
  fetchAudienceFilters() {
    let component = this;
    let filterList = [];
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let audiencePromise = Ember.RSVP.resolve(
      component.get('lookupService').readAudiences()
    );
    return Ember.RSVP.hash({
      audienceFilters: audiencePromise
    }).then(function(hash) {
      hash.audienceFilters.map(audience => {
        let audienceInfo = {
          label: audience.label,
          code: audience.id,
          value: audience.sequence_id
        };
        if (
          selectedFilterItems.audience !== undefined &&
          selectedFilterItems.audience.length > 0
        ) {
          audienceInfo.checked = component.isFilterSelected(
            audience.id,
            selectedFilterItems.audience
          );
        }
        filterList.push(audienceInfo);
      });
      component.set('filterList', filterList);
    });
  },

  /**
   * @function fetchCenturySkillFilters
   * Method to fetch century skill filter items
   */
  fetchCenturySkillFilters() {
    let component = this;
    let filterList = [];
    let userId = component.get('session.id');
    let storedFilters =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    if (component.get('isToggleExpanded')) {
      let centurySkillsPromise = Ember.RSVP.resolve(
        component.get('lookupService').read21CenturySkills()
      );
      return Ember.RSVP.hash({
        centurySkills: centurySkillsPromise
      }).then(function(hash) {
        let modalData = {
          centurySkills: hash.centurySkills,
          selectedCenturySkills: storedFilters['21-century-skills'],
          callback: {
            success: function(selectedCenturySkills) {
              selectedCenturySkills.map(centurySkill => {
                let centurySkillInfo = {
                  code: centurySkill.id,
                  label: centurySkill.label,
                  value: centurySkill.group,
                  checked: true,
                  id: centurySkill.id
                };
                filterList.push(centurySkillInfo);
              });
              storedFilters['21-century-skills'] = filterList;
              localStorage.setItem(
                `research_${userId}_activities_filters`,
                JSON.stringify(storedFilters)
              );
              component.sendAction(
                'onSelectCenturySkills',
                storedFilters,
                selectedCenturySkills
              );
              component.set('filterList', filterList);
            }
          }
        };
        component.send(
          'showModal',
          'modals.activity.century-skills',
          modalData
        );
      });
    } else {
      component.set('filterList', storedFilters['21-century-skills']);
    }
  },

  /**
   * @function fetchLicenses
   * Method to fetch license filter items
   */
  fetchLicenses() {
    let component = this;
    let filterList = [];
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let licensesPromise = Ember.RSVP.resolve(
      component.get('lookupService').readLicenses()
    );
    return Ember.RSVP.hash({
      licenseList: licensesPromise
    }).then(function(hash) {
      hash.licenseList.map(license => {
        let licenseInfo = {
          label: license.label,
          code: license.code,
          id: license.id,
          value: license.sequence_id
        };
        if (
          selectedFilterItems.licenses !== undefined &&
          selectedFilterItems.licenses.length > 0
        ) {
          licenseInfo.checked = component.isFilterSelected(
            license.id,
            selectedFilterItems.licenses
          );
        }
        filterList.push(licenseInfo);
      });
      component.set('filterList', filterList);
    });
  },

  /**
   * @function fetchDok
   * Method to fetch Depth of Knowledge filter items
   */
  fetchDok() {
    let component = this;
    let filterList = [];
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let dokPromise = Ember.RSVP.resolve(
      component.get('lookupService').readDepthOfKnowledgeItems()
    );
    return Ember.RSVP.hash({
      dokItems: dokPromise
    }).then(function(hash) {
      hash.dokItems.map(dok => {
        let dokInfo = {
          label: dok.label,
          code: dok.id,
          value: dok.sequence_id
        };
        if (
          selectedFilterItems.dok !== undefined &&
          selectedFilterItems.dok.length > 0
        ) {
          dokInfo.checked = component.isFilterSelected(
            dok.id,
            selectedFilterItems.dok
          );
        }
        filterList.push(dokInfo);
      });
      component.set('filterList', filterList);
    });
  },

  /**
   * @function fetchPublisherFilters
   * Method to fetch publisher filter items
   */
  fetchPublisherFilter() {
    let component = this;
    let filterList = [];
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let publisherPromise = Ember.RSVP.resolve(
      component.get('profileService').getUserPrefsProviders(userId)
    );
    return Ember.RSVP.hash({
      publisherList: publisherPromise
    }).then(function(hash) {
      hash.publisherList.map(publisher => {
        let publisherInfo = {
          label: publisher.providerName,
          code: publisher.providerId,
          value: publisher.providerId
        };
        if (
          selectedFilterItems.publisher !== undefined &&
          selectedFilterItems.publisher.length > 0
        ) {
          publisherInfo.checked = component.isFilterSelected(
            publisher.providerId,
            selectedFilterItems.publisher
          );
        }
        filterList.push(publisherInfo);
      });
      component.set('filterList', filterList);
    });
  },

  /**
   * @function fetchQuestionTypeFilters
   * Method to fetch question type items from config and show it into filter component
   */
  fetchQuestionTypeFilters() {
    let component = this;
    let questionTypeConfig = QUESTION_TYPE_CONFIG;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let filterList = [];
    const i18n = component.get('i18n');
    questionTypeConfig.map(questionType => {
      let questionTypeInfo = {
        label: String(i18n.t(questionType.label)),
        code: questionType.apiCode,
        value: questionType.value
      };
      if (
        selectedFilterItems.qt !== undefined &&
        selectedFilterItems.qt.length > 0
      ) {
        let selectedQuestionTypes = selectedFilterItems.qt;
        questionTypeInfo.checked = component.isFilterSelected(questionType.apiCode, selectedQuestionTypes);
      }
      filterList.push(questionTypeInfo);
    });
    component.set('filterList', filterList);
  },

  /**
   * @function fetchResourceTypeFilters
   * Method to fetch resource type items from config and show it into filter component
   */
  fetchResourceTypeFilters() {
    let component = this;
    let resourceTypeConfig = RESOURCE_TYPE_CONFIG;
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let filterList = [];
    const i18n = component.get('i18n');
    resourceTypeConfig.map(resourceType => {
      let resourceTypeInfo = {
        label: String(i18n.t(resourceType.label)),
        code: resourceType.apiCode,
        value: resourceType.value
      };
      if (
        selectedFilterItems.rt !== undefined &&
        selectedFilterItems.rt.length > 0
      ) {
        let selectedResourceTypes = selectedFilterItems.rt;
        resourceTypeInfo.checked = component.isFilterSelected(resourceType.apiCode, selectedResourceTypes);
      }
      filterList.push(resourceTypeInfo);
    });
    component.set('filterList', filterList);
  }
});
