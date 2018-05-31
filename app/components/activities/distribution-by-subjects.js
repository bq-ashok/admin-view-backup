import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['activities-distribution-by-subjects'],

  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * activities service dependency injection
   * @type {Object}
   */
  activityService: Ember.inject.service('api-sdk/activities'),

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super(...arguments);
    this.renderDistributionBySubjectsCharts();
  },

  /**
   * Observe the filte changes
   */
  filtersObserver: Ember.observer('appliedFilterList', function() {
    let component = this;
    component.renderDistributionBySubjectsCharts();
  }),

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Content distribution by subjects
   * @type {Array}
   */
  subjects: Ember.A(),

  /**
   * It  indicates the state of loader icon
   * @type {Boolean}
   */
  isLoading: false,

  /**
   * Content legends
   * @type {Array}
   */
  contentLegends: Ember.A([
    {
      name: 'questions',
      colorCode: '#BFE1DB'
    },
    {
      name: 'resources',
      colorCode: '#8ED1C7'
    },
    {
      name: 'assessments',
      colorCode: '#58B8AA'
    },
    {
      name: 'collections',
      colorCode: '#07A392'
    },
    {
      name: 'courses',
      colorCode: '#008D7C'
    }
  ]),

  // -------------------------------------------------------------------------
  // Methods

  renderDistributionBySubjectsCharts() {
    let component = this;
    let term = component.get('term');
    let appliedFilterList = component.get('appliedFilterList') || {};
    term = term !== '' ? term : '*';
    component.set('isLoading', true);
    let mathsSubjectFilter = {
      'flt.subject': 'K12.MA'
    };
    mathsSubjectFilter = Object.assign(mathsSubjectFilter, appliedFilterList);
    let scienceSubjectFilter = {
      'flt.subject': 'K12.SC'
    };
    scienceSubjectFilter = Object.assign(
      scienceSubjectFilter,
      appliedFilterList
    );
    let socialScienceSubjectFilter = {
      'flt.subject': 'K12.SS'
    };
    socialScienceSubjectFilter = Object.assign(
      socialScienceSubjectFilter,
      appliedFilterList
    );
    let ELAScienceSubjectFilter = {
      'flt.subject': 'K12.ELA'
    };
    ELAScienceSubjectFilter = Object.assign(
      ELAScienceSubjectFilter,
      appliedFilterList
    );
    Ember.RSVP.hash({
      maths: component
        .get('activityService')
        .getLearningMaps(mathsSubjectFilter, term),
      science: component
        .get('activityService')
        .getLearningMaps(scienceSubjectFilter, term),
      socialScience: component
        .get('activityService')
        .getLearningMaps(socialScienceSubjectFilter, term),
      ela: component
        .get('activityService')
        .getLearningMaps(ELAScienceSubjectFilter, term)
    }).then(({ maths, science, socialScience, ela }) => {
      let subjects = Ember.A();
      subjects.pushObject(component.mapContentCountsBySubject('Maths', maths));
      subjects.pushObject(
        component.mapContentCountsBySubject('Science', science)
      );
      subjects.pushObject(
        component.mapContentCountsBySubject('Social Science', socialScience)
      );
      subjects.pushObject(component.mapContentCountsBySubject('ELA', ela));
      component.set('subjects', subjects);
      component.set('isLoading', false);
    });
  },

  mapContentCountsBySubject(name, subject) {
    let questionCounts = subject.get('question').get('totalHitCount');
    let resourceCounts = subject.get('resource').get('totalHitCount');
    let assessmentCounts = subject.get('assessment').get('totalHitCount');
    let collectionCounts = subject.get('collection').get('totalHitCount');
    let courseCounts = subject.get('course').get('totalHitCount');
    let totalCount =
      questionCounts +
      resourceCounts +
      assessmentCounts +
      collectionCounts +
      courseCounts;
    let contentCounts = Ember.A([
      {
        name: 'questions',
        value: subject.get('question').get('totalHitCount'),
        colorCode: '#BFE1DB'
      },
      {
        name: 'resources',
        value: subject.get('resource').get('totalHitCount'),
        colorCode: '#8ED1C7'
      },
      {
        name: 'assessments',
        value: subject.get('assessment').get('totalHitCount'),
        colorCode: '#58B8AA'
      },
      {
        name: 'collections',
        value: subject.get('collection').get('totalHitCount'),
        colorCode: '#07A392'
      },
      {
        name: 'courses',
        value: subject.get('course').get('totalHitCount'),
        colorCode: '#008D7C'
      }
    ]);
    let result = Ember.Object.create({
      name: name,
      totalCount: totalCount,
      contentCounts: contentCounts
    });
    return result;
  }
});
