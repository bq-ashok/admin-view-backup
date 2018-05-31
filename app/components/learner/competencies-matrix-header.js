import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['competencies-matric-header'],


  // -------------------------------------------------------------------------
  // Properties


  /**
   * data of the learner
   * @type {Array}
   */
  isDomainView: true,

  actions: {
    onChangeHeaderView(selectedView) {
      let component = this;
      component.sendAction('onChangeHeaderView', selectedView);
      component.set('isCourseView', selectedView === 'course');
      component.set('isDomainView', selectedView === 'domain');
      component.set('isListView', selectedView === 'list');

    }
  }
});
