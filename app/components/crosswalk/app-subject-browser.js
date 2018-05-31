import Ember from 'ember';
import {TAXONOMY_CATEGORIES} from 'admin-dataview/config/config';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['app-subject-browser'],

  // -------------------------------------------------------------------------
  // Dependencies
  /**
  * Search service to fetch content details
  */
  taxonomyService: Ember.inject.service('taxonomy'),

  // -------------------------------------------------------------------------
  // Properties

  /**
  * List of categories
  */
  categories: TAXONOMY_CATEGORIES,

  /**
  * List of subjects
  */
  subjects: [],

  /**
  * List of frameworks
  */
  frameworks: [],

  /**
  * Selected category id
  */
  currentCategoryId: 'k_12',

  /**
  * Selected subject id
  */
  currentSubjectId: null,

  /**
  * Is subject level visible
  */
  isShowSubjectLevel: false,

  /**
  * Is framework level visible
  */
  isShowFrameworkLevel: false,

  /**
  * Default category
  */
  defaultCategory: 'k_12',

  // -------------------------------------------------------------------------
  // Events

  init: function() {
    let component = this;
    component._super(...arguments);
    let currentSubject = component.fetchTaxonomySubjects(component.get('defaultCategory'));
    currentSubject.then(function(subject) {
      component.set('currentSubjectId', subject.id);
      component.fetchTaxonomyFrameworks(subject);
    });
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
    * Action triggered when user click category to pull subjects
    */
    getSubjects: function(category) {
      let component = this;
      let currentCategoryId = component.get('currentCategoryId');
      if (currentCategoryId !== category) {
        component.set('currentCategoryId', category);
        component.sendAction('disableGenerateBtn', category);
        return component.fetchTaxonomySubjects(category);
      }
      return true;
    },

    /**
    * Action triggered when user click subject to pull frameworks
    */
    getFrameworks: function(subject) {
      let component = this;
      let category = component.get('currentCategoryId');
      component.set('currentSubjectId', subject.id);
      component.sendAction('disableGenerateBtn', category, subject);
      return component.fetchTaxonomyFrameworks(subject);
    },

    /**
    * Action triggered when user select a framework
    */
    frameworkStack: function(frameworkId) {
      let component = this;
      let subjectId = component.get('currentSubjectId');
      return component.sendAction('frameworkStack', subjectId, frameworkId);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  /**
  * @param category
  * Method to fetchTaxonomySubjects
  */
  fetchTaxonomySubjects(category) {
    let component = this;
    const subjectsPromise = Ember.RSVP.resolve(component.get('taxonomyService').getSubjects(category));
    return Ember.RSVP.hash({
      subjectsList: subjectsPromise
    })
      .then(function(hash) {
        component.set('subjects', hash.subjectsList);
        component.set('isShowFrameworkLevel', false);
        component.set('isShowSubjectLevel', true);
        //Use Math as default subject
        return hash.subjectsList[1];
      });
  },

  /**
  * @param subject
  * Method to fetchTaxonomyFrameworks
  */
  fetchTaxonomyFrameworks(subject) {
    let component = this;
    component.set('frameworks', subject.frameworks);
    component.set('isShowFrameworkLevel', true);
  }
});
