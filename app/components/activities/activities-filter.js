import Ember from 'ember';

export default Ember.Component.extend({
  //------------------------------------------------------------------------
  //Attributes
  classNames: ['activities-filter'],

  //------------------------------------------------------------------------
  //Dependencies
  session: Ember.inject.service('session'),

  //------------------------------------------------------------------------
  //Properties
  selectedFilterItems: {},

  isFilterUpdated: false,

  clearSearchRefresh: Ember.observer('toggleClearSearch', function() {
    let component = this;
    component.set('selectedFilterItems', JSON.stringify({}));
    component.$('.filter-name  input').prop('checked', false);
  }),

  /**
   * Observe filter changes
   */
  filterObserver: Ember.observer('isFilterUpdated', function() {
    let component = this;
    component.toggleFilterVisibility();
  }),

  //------------------------------------------------------------------------
  //Events
  didInsertElement() {
    let component = this;
    component.toggleFilterVisibility();
  },

  //------------------------------------------------------------------------
  //Actions
  actions: {
    /**
     * @function onClickCheckbox
     * Action triggered when the user click on the checkbox
     */
    onClickCheckbox(filterInfo, filterType) {
      let component = this;
      let selectedFilterItems = component.getUpdtedFilterItems(
        filterInfo,
        filterType
      );
      if (filterType === 'category' || filterType === 'subject') {
        component.toggleCheckboxProperty(filterType, filterInfo.code);
        component.toggleExpandedComponent(filterType);
      }
      component.set('selectedFilterItems', selectedFilterItems);
      component.toggleProperty('isFilterUpdated');
    },

    onSelectCenturySkills(storedFilters) {
      let component = this;
      component.sendAction('onChangeFilterItems', storedFilters);
    },

    clearFilters() {
      this.sendAction('clearFilter');
    }
  },

  //------------------------------------------------------------------------
  //Methods

  /**
   * @function getUpdtedFilterItems
   * Method to update localStorage with latest filter selection
   */
  getUpdtedFilterItems(filterInfo, filterType) {
    let component = this;
    let userId = component.get('session.id');
    let storedFilters =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    let userSelectedFilter = storedFilters[`${filterType}`] || [];
    let userSelectedFilterIndex = userSelectedFilter.findIndex(function(item) {
      let filterId = filterInfo.id || filterInfo.code;
      return item.id === filterId;
    });
    //if filter already selected, then remove it from the list
    if (userSelectedFilterIndex > -1) {
      userSelectedFilter.splice(userSelectedFilterIndex, 1);
    } else {
      //if new filter selected by user
      if (filterType === 'subject' || filterType === 'category') {
        userSelectedFilter[0] = component.getStructuredDataItemsByFilterType(
          filterType,
          filterInfo
        );
      } else {
        userSelectedFilter.push(
          component.getStructuredDataItemsByFilterType(filterType, filterInfo)
        );
      }
    }
    storedFilters = component.removedFilterItemsByType(filterType, storedFilters);
    storedFilters[`${filterType}`] = userSelectedFilter;
    localStorage.setItem(
      `research_${userId}_activities_filters`,
      JSON.stringify(storedFilters)
    );
    component.sendAction('onChangeFilterItems', storedFilters);
    return storedFilters;
  },

  /**
   * @function getStructuredDataItemsByFilterType
   * Method to get structured filter data based on the filter type
   */
  getStructuredDataItemsByFilterType(filterType, filterInfo) {
    let userSelectedFilterItem = {};
    if (filterType === 'subject') {
      userSelectedFilterItem = {
        id: filterInfo.code,
        label: filterInfo.label,
        frameworkId: filterInfo.value.frameworkId
      };
    } else if (filterType === 'licenses') {
      userSelectedFilterItem = {
        code: filterInfo.code,
        label: filterInfo.label,
        id: filterInfo.id
      };
    } else {
      userSelectedFilterItem = {
        id: filterInfo.code,
        label: filterInfo.label
      };
    }
    return userSelectedFilterItem;
  },

  /**
   * @function toggleCheckboxProperty
   * Method to toggle checkbox checked property
   */
  toggleCheckboxProperty(filterType, id) {
    let component = this;
    let curFilter = typeof id === 'string' ? id.replace(/\./g, '-') : id;
    let filterComponent = `.${filterType} .body`;
    component
      .$(`${filterComponent} .filter-name div input`)
      .prop('checked', false);
    component
      .$(`${filterComponent} .filter-name .${curFilter} input`)
      .prop('checked', true);
  },

  /**
   * @function toggleExpandedComponent
   * Method to toggle expanded view of a filter component
   */
  toggleExpandedComponent(filterType) {
    let component = this;
    let filterItemsToToggle = [];
    if (filterType === 'category') {
      filterItemsToToggle = ['course', 'subject'];
    } else if (filterType === 'subject') {
      filterItemsToToggle = ['course'];
    }
    filterItemsToToggle.map(filterComponent => {
      if (
        component
          .$(`.${filterComponent}`)
          .parent()
          .hasClass('expanded')
      ) {
        component.$(`.${filterComponent} .header .toggle-dropdown`).click();
      }
    });
  },

  /**
   * @function toggleFilterVisibility
   * Method to toggle filter visibility
   */
  toggleFilterVisibility() {
    let component = this;
    const $filterComponent = '.activities-filter .filters';
    let userId = component.get('session.id');
    let selectedFilterItems =
      JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      ) || component.get('selectedFilterItems');
    if (selectedFilterItems) {
      let isCategoryFilterApplied = selectedFilterItems.category
        ? selectedFilterItems.category.length || null
        : null;
      let isSubjectFilterApplied = selectedFilterItems.subject
        ? selectedFilterItems.subject.length || null
        : null;
      if (isCategoryFilterApplied) {
        Ember.$(`${$filterComponent} .subject`).removeClass('deactivated');
        if (isSubjectFilterApplied) {
          Ember.$(`${$filterComponent} .course`).removeClass('deactivated');
        } else {
          Ember.$(`${$filterComponent} .course`).addClass('deactivated');
        }
      } else {
        Ember.$(`${$filterComponent} .subject`).addClass('deactivated');
        Ember.$(`${$filterComponent} .course`).addClass('deactivated');
      }
    }
  },

  /**
   * @function removedFilterItemsByType
   * Method to remove applied filter items when toggling parent filter type
   */
  removedFilterItemsByType(filterType, selectedFilterItems) {
    if (filterType === 'category') {
      selectedFilterItems.course = [];
      selectedFilterItems.subject = [];
    } else if (filterType === 'subject') {
      selectedFilterItems.course = [];
    }
    return selectedFilterItems;
  }
});
