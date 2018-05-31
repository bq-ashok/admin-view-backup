import Ember from 'ember';
import { DEFAULT_ACTIVITY_FILTERS, ACTIVITY_FILTER, QUESTION_TYPE_FILTERS, RESOURCE_TYPE_FILTERS } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['search-box'],

  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Array}
   * List of filter types
   */
  filterTypes: Ember.computed('curMenuItem', function() {
    let defaultFilter = DEFAULT_ACTIVITY_FILTERS;
    let activityFilter = ACTIVITY_FILTER;
    let resourceTypeFilters = RESOURCE_TYPE_FILTERS;
    let questionTypeFilters = QUESTION_TYPE_FILTERS;
    return defaultFilter.concat(activityFilter, resourceTypeFilters, questionTypeFilters);
  }),

  /**
   * @property {Array}
   * List of Applied filters
   */
  appliedFilterList: Ember.A([]),

  /**
   * @property {Array}
   * List of filters should be visible to user at searchbox
   */
  filtersObserver: Ember.observer('selectedFilterItems', function() {
    let component = this;
    component.refreshVisibleFilterItems();
    component.setupTooltip();
  }),

  /**
   * @property {Number}
   * Number of filter tags should visible in the search box
   */
  visibleFilterCount: 3,

  /**
   * @property {Number}
   * Number of filter tags should visible in the popover content box
   */
  invisibleFilterCount: Ember.computed('appliedFilterList', function() {
    let component = this;
    return (
      component.get('appliedFilterList.length') -
      component.get('visibleFilterCount')
    );
  }),

  /**
   * Validate if the property term has the correct number of characters
   * @property
   */
  isIncorrectTermSize: Ember.computed('tempTerm', function() {
    var term = $.trim(this.get('tempTerm'));
    return !term || term.length < 3;
  }),

  /**
   * @property {?string} action to send up when searching for a term
   */
  onSearch: null,

  /**
   * Search term
   * @property {string}
   */
  term: null,

  /**
   * isTyping
   * @property {Boolean}
   */
  isTyping: null,

  isInvalidSearchTerm: false,

  tempTerm: Ember.computed.oneWay('term'),

  /**
   * @type {String}
   * Current menu item
   */
  curMenuItem: null,

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    let component = this;
    component.refreshVisibleFilterItems();
    if (component.get('appliedFilterList.length')) {
      component.setupTooltip();
    }
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * @function onRemoveFilter
     * Action triggered when the user click on the clear button in applied filter tag
     */
    onRemoveFilter(selectedFilter) {
      let component = this;
      let userId = component.get('session.id');
      let storedFilters = JSON.parse(
        localStorage.getItem(`research_${userId}_activities_filters`)
      );
      if (storedFilters) {
        let filterType = selectedFilter.type;
        let categorizedFilterData = storedFilters[`${filterType}`];
        let userRemovedFilterIndex = categorizedFilterData.findIndex(function(
          item
        ) {
          return item.id === selectedFilter.id;
        });
        //if filter already selected, then remove it from the list
        if (userRemovedFilterIndex > -1) {
          categorizedFilterData.splice(userRemovedFilterIndex, 1);
        }
        storedFilters[`${filterType}`] = categorizedFilterData;
        localStorage.setItem(
          `research_${userId}_activities_filters`,
          JSON.stringify(storedFilters)
        );
        component.set('selectedFilterItems', storedFilters);
        //Trigger action to update the search results
        component.sendAction(
          'onChangeFilterItems',
          storedFilters,
          selectedFilter
        );
      }
    },

    searchTerm() {
      var tempTerm = $.trim(this.get('tempTerm'));
      var term = $.trim(this.get('term'));
      var isEmptyTerm = tempTerm === '' && term !== '';
      var isIncorrectTermSize = this.get('isIncorrectTermSize');
      if (!isIncorrectTermSize || isEmptyTerm) {
        this.set('term', tempTerm);
        this.set('isInvalidSearchTerm', false);
        this.sendAction('onSearch', this.get('term'));
      } else {
        this.set('term', term);
        this.sendAction('searchStatus');
      }
    },

    inputValueChange() {
      this.set('isTyping', false);
    },

    clearSearchText() {
      this.set('tempTerm', '');
      this.sendAction('clearSearchText');
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function getAppliedFilters
   * Return list of applied filters
   */
  getAppliedFilters() {
    let component = this;
    let storedFilters = component.get('selectedFilterItems') || null;
    let filterTypes = component.get('filterTypes');
    let applicableFilterList = [];
    if (storedFilters) {
      filterTypes.map(filterType => {
        let filterCode = filterType.code;
        let categorizedFilterData = storedFilters[`${filterCode}`];
        if (categorizedFilterData) {
          categorizedFilterData.map(filterData => {
            if (filterData) {
              filterData.type = filterCode;
              applicableFilterList.push(filterData);
            }
          });
        }
      });
    }
    return applicableFilterList;
  },

  /**
   * @function refreshVisibleFilterItems
   * Method to refresh visible search filter tag
   */
  refreshVisibleFilterItems() {
    let component = this;
    let appliedFilterList = component.getAppliedFilters();
    component.set('appliedFilterList', appliedFilterList);
    const filtersVisible = component.get('visibleFilterCount');
    let visibleFilters = appliedFilterList.filter(function(filter, index) {
      return index < filtersVisible;
    });
    component.sendAction('onEmptyFilters', visibleFilters.length === 0);
    component.set('visibleFilters', visibleFilters);
  },

  /**
   * @function setupTooltip
   * Function to show popover content box while clicking on the more button
   */
  setupTooltip() {
    let component = this;
    var $anchor = component.$('button.non-visible-tags');

    if ($anchor.length) {
      let placement = 'bottom';
      $anchor.addClass('clickable');
      $anchor.attr('data-html', 'true');
      $anchor.popover({
        placement: placement,
        content: function() {
          return component.$('.non-visible-filters').html();
        },
        trigger: 'manual'
      });

      $anchor.click(function() {
        var $this = $(this);
        if (!$this.hasClass('list-open')) {
          // Close all tag-list popovers by simulating a click on them
          $('.non-visible-tags.list-open').click();
          $this.addClass('list-open').popover('show');
        } else {
          $this.removeClass('list-open').popover('hide');
        }
      });
    }
  }
});
