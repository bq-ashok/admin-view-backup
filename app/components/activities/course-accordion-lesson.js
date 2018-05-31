import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['course-accordion-lesson'],

  /**
   * @requires service:performance
   */
  contentService: Ember.inject.service('api-sdk/content'),

  collections: null,

  actions: {
    onToggle(lessonId) {
      let component = this;
      component.fetchCollections(lessonId);
    }
  },

  fetchCollections(lessonId) {
    let component = this;
    let lessonBody = component.$('.lesson-body');
    if (component.get('isExpanded')) {
      lessonBody.slideUp();
    } else {
      let courseId = component.get('courseId');
      let unitId = component.get('unit.unit_id');
      let collectionPromise = Ember.RSVP.resolve(component.get('contentService').getCollectionByLessonId(courseId, unitId, lessonId));
      Ember.RSVP.hash({
        collectionData: collectionPromise
      })
        .then(function(hash) {
          component.set('collections', hash.collectionData.collectionSummary);
        });
      lessonBody.slideDown();
    }
    component.toggleProperty('isExpanded');
  }
});
