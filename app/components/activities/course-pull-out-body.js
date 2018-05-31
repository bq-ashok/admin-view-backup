import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['pull-out', 'course-pull-out-body'],

  contentCount: Ember.computed('course', function() {
    let component = this;
    let course = component.get('course');
    let countInfo = [];
    if (course) {
      countInfo = [
        {
          type: 'unit',
          count: course.unitCount
        },
        {
          type: 'lesson',
          count: course.lessonCount
        },
        {
          type: 'collection',
          count: course.collectionCount
        },
        {
          type: 'assessment',
          count: course.assessmentCount
        }
      ];
    }
    return countInfo;
  }),

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  }
});
