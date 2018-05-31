import Ember from 'ember';
import { LEARNING_MAP_DEFAULT_LEVELS } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['cards', 'app-domain-browser-card'],

  // -------------------------------------------------------------------------
  // Events
  didInsertElement() {
    let component = this;
    component.$('.category .k_12').addClass('active');
    // this.checkDefaultItem();
  },

  dataItemObserver: Ember.observer('dataContent', function() {
    this.checkDefaultItem();
  }),

  /**
   * @function checkDefaultItem
   * Method to set first item in each component selected by default
   */
  checkDefaultItem() {
    let defaultLevels = LEARNING_MAP_DEFAULT_LEVELS;
    const $categoryComponent = Ember.$('.category .item');
    const $subjectComponent = Ember.$('.subject .item');
    const $courseComponent = Ember.$('.course .item');
    if (!$categoryComponent.hasClass('active')) {
      Ember.$(`.category .item.${defaultLevels.categoryCode}`).addClass(
        'active'
      );
    }
    if (!$subjectComponent.hasClass('active')) {
      Ember.$(
        `.subject .item.${defaultLevels.subjectCode.replace(/\./, '-')}`
      ).addClass('active');
    }
    if (!$courseComponent.hasClass('active')) {
      Ember.$(
        `.course .item.${defaultLevels.courseCode.replace(/\./, '-')}`
      ).addClass('active');
    }
    let domainCodes = defaultLevels.domainCode || null;
    if (domainCodes) {
      domainCodes = domainCodes.split(',');
      domainCodes.map(domainCode => {
        Ember.$(`.domain .item.${domainCode.replace(/\./, '-')} input`).prop('checked', true);
      });
    }
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the user select a data item
     */
    onSelectDataItem(type, dataItem) {
      let component = this;
      let id = dataItem.id || dataItem.value;
      component.toggleActiveElement(type, id);
      component.sendAction('onSelectDataItem', type, dataItem);
    },

    /**
     * Action triggered when the user select a domain item
     */
    onSelectDomain(domainId) {
      let component = this;
      component.sendAction('onSelectDomain', domainId);
    }
  },

  // -------------------------------------------------------------------------
  // Methods
  /**
   * @function toggleActiveElement
   * Method to toggle active element
   */
  toggleActiveElement(type, id) {
    let component = this;
    id = id.replace(/\./g, '-');
    component.$(`.${type} .item`).removeClass('active');
    component.$(`.${type} .${id}`).addClass('active');
  }
});
