import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['course-accordion-collection'],

  /**
   * @requires service:content
   */
  contentService: Ember.inject.service('api-sdk/content'),

  collectionContents: null,

  isCollection: true,

  actions: {
    onToggle(collection) {
      let component = this;
      if (collection.format === 'assessment') {
        component.fetchAssessmentItems(collection.id);
      } else {
        component.fetchCollectionItems(collection.id);
      }
    }
  },

  fetchCollectionItems(collectionId) {
    let component = this;
    let collectionBody = component.$('.collection-body');
    if (component.get('isExpanded')) {
      collectionBody.slideUp();
    } else {
      let collectionPromise = Ember.RSVP.resolve(component.get('contentService').getCollectionById(collectionId));
      Ember.RSVP.hash({
        collectionItems: collectionPromise
      })
        .then(function(hash) {
          component.set('collectionContents', hash.collectionItems.content);
          component.set('isCollection', true);
          component.set('isExpanded', true);
          collectionBody.slideDown();
        });
    }
    component.toggleProperty('isExpanded');
  },

  fetchAssessmentItems(assessmentId) {
    let component = this;
    let collectionBody = component.$('.collection-body');
    if (component.get('isExpanded')) {
      collectionBody.slideUp();
    } else {
      let assessmentPromise = Ember.RSVP.resolve(component.get('contentService').getAssessmentById(assessmentId));
      Ember.RSVP.hash({
        assessmentItems: assessmentPromise
      })
        .then(function(hash) {
          component.set('collectionContents', hash.assessmentItems.question);
          component.set('isExpanded', true);
          component.set('isCollection', false);
          collectionBody.slideDown();
        });
    }
    component.toggleProperty('isExpanded');
  }
});
