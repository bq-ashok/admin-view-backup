import Ember from 'ember';
import { dataCountFormat as countformat } from 'admin-dataview/utils/utils';

export default Ember.Controller.extend({
  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:learners
   */
  learnersService: Ember.inject.service('api-sdk/learners'),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Subject base learner profile distribution
   * @return {Object}
   */
  subjects: Ember.computed(function() {
    const subjects = this.get('learnersProfileDistribution.subjects');
    subjects.forEach(function(subject) {
      subject.set('categoryId', subject.get('code').split('.')[0]);
    });
    return subjects;
  }),

  /**
   * geo location based learner profile distribution
   * @return {Object}
   */
  geoLocations: Ember.computed.alias(
    'learnersProfileDistribution.geoLocations'
  ),

  /**
   * geo location based learner profile distribution by subject
   * @return {Object}
   */
  geoLocationsBySubject: Ember.computed.alias(
    'learnerProfileDistributionBySubject.geoLocations'
  ),

  /**
   *  learners profile distribution by subject
   * @type {Object}
   */
  learnerProfileDistributionBySubject: null,

  /**
   * Selected subject
   * @type {Object}
   */
  selectedSubject: null,

  /**
   * selected subject title
   * @type {Object}
   */
  selectedTitleSubjectHeader: Ember.computed('selectedSubject', function() {
    let controller = this;
    let selectedSubject = controller.get('selectedSubject');
    return `${countformat(
      selectedSubject.get('active')
    )}  ${controller.get('i18n').t('common.active').string} ${selectedSubject.get('name')}  ${controller.get('i18n').t('common.users').string}`;
  }),

  /**
   * List of selected user active distrbution
   * @type {Object}
   */
  activeUserDistrbutionBySubject: null,

  // -------------------------------------------------------------------------
  // actions

  actions: {
    onSelectActiveUsers(subject) {
      let controller = this;
      Ember.RSVP.hash({
        activeUserDistrbutionBySubject: controller
          .get('learnersService')
          .getActiveUserDistrbutionBySubject(subject.get('code')),
        learnerProfileDistributionBySubject: controller
          .get('learnersService')
          .getLearnerProfileDistribution(subject.get('code'))
      }).then(
        ({
          activeUserDistrbutionBySubject,
          learnerProfileDistributionBySubject
        }) => {
          controller.set(
            'activeUserDistrbutionBySubject',
            activeUserDistrbutionBySubject
          );
          controller.set(
            'learnerProfileDistributionBySubject',
            learnerProfileDistributionBySubject
          );
          controller.set('selectedSubject', subject);
        }
      );
    },

    onClickBackButton() {
      this.set('selectedSubject', null);
    },

    onSelectUser(user) {
      this.transitionToRoute('learner', user.get('userId'));
    }
  }
});
