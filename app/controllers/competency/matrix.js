import Ember from 'ember';
import Utils from 'admin-dataview/utils/taxonomy';
import { CONTENT_TYPES } from 'admin-dataview/config/config';

export default Ember.Controller.extend({
  //---------------------------------------------------------------------------
  //Dependencies

  session: Ember.inject.service(),

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  /**
   * Search service to fetch content details
   */
  searchService: Ember.inject.service('api-sdk/search'),

  //---------------------------------------------------------------------------
  //Properties

  /**
   * It will have the data of  latest selected subject object.
   * @return {Object}
   */
  selectedSubject: Ember.computed('subjects', function() {
    let subject = this.get('subjects').objectAt(0);
    return subject;
  }),

  /**
   * Currently logged in user Id
   * @type {userId}
   */
  userId: Ember.computed.alias('session.user.id'),

  /**
   * It maintains the state of pull out visibility
   * @type {Boolean}
   */
  showPullOut: false,

  /**
   * Selected domain data
   */
  selectedDomainData: null,

  /**
   * Content count of the selected domain data
   */
  contentCount: null,

  /**
   * It maintains the latest selected category, by default it will be k_12.
   * @type {String}
   */
  selectedCategory: 'k_12',

  /**
   * Show loading spinner
   */
  isLoading: true,

  /**
   * is competency level node or not
   */
  showMore: false,

  /**
   * List of resource contents
   */
  resourceContent: null,

  /**
   * List of collection contents
   */
  collectionContent: null,

  /*
   * List of assessment contents
   */
  assessmentContent: null,

  /*
   * List of question contents
   */
  questionContent: null,

  /*
   * List of course contents
   */
  courseContent: null,

  /*
   * List of unit contents
   */
  unitContent: null,

  /*
   * List of lesson contents
   */
  lessonContent: null,

  /*
   * List of subjects
   */
  subjects: null,

  //---------------------------------------------------------------------------
  //Actions

  actions: {
    /**
     * Action get triggred when subject get choosen
     * @param  {Number} subjectIndex
     */
    onChooseSubject(subjectIndex) {
      let controller = this;
      let subjects = controller.get('subjects');
      let subject = subjects.objectAt(subjectIndex);
      controller.set('selectedSubject', subject);
      Ember.$('.subject-name').removeClass('active');
      Ember.$('.subject-round-icon').removeClass('active');
      Ember.$(`.subject-${subjectIndex}`).addClass('active');
    },

    /**
     * Action get triggered when domain cell clicked
     * @param  {Object} category
     */
    onChooseDomain(selectedDomain) {
      let controller = this;
      controller.set('selectedDomainCompetency', selectedDomain);
      let domainId = `${selectedDomain.courseCode}-${
        selectedDomain.domainCode
      }`;
      let subjectName = controller.get('selectedSubject.title');
      let subjectCode = controller.get('selectedSubject.code');
      let selectedDomainData = Ember.Object.create({
        id: domainId,
        name: selectedDomain.domainName,
        code: domainId,
        parent: `${subjectName}  > ${selectedDomain.courseName}`,
        filters: {
          'flt.subject': subjectCode,
          'flt.course': selectedDomain.courseCode,
          'flt.domain': domainId
        }
      });
      controller.set('selectedDomainData', selectedDomainData);
      controller.set('showPullOut', true);
      controller.set('isLoading', true);
      controller
        .getSearchContentCount(selectedDomainData)
        .then(function(contentCount) {
          controller.set('contentCount', contentCount);
          controller.set('isLoading', false);
        });
    },

    domainCompetencyPullOut(competency, status) {
      let controller = this;
      let selectedDomain = controller.get('selectedDomainCompetency');
      let domainId = `${selectedDomain.courseCode}-${
        selectedDomain.domainCode
      }`;

      let subjectName = controller.get('selectedSubject.title');
      let subjectCode = controller.get('selectedSubject.code');
      let selectedCompetencyData = Ember.Object.create({
        id: domainId,
        name: selectedDomain.domainName,
        code: domainId,
        type: 'standard',
        parent:
          status === 'microCompetency'
            ? `${subjectName}  > ${selectedDomain.courseName}  > ${
              selectedDomain.domainName
            } > ${competency.title}`
            : `${subjectName}  > ${selectedDomain.courseName}  > ${
              selectedDomain.domainName
            }`,
        title: competency.title,
        filters: {
          'flt.subject': subjectCode,
          'flt.courseName': selectedDomain.courseName,
          'flt.domainName': selectedDomain.domainName,
          'flt.standardDisplay': competency.code
        }
      });
      controller.set('selectedDomainData', selectedCompetencyData);

      let nodeInfo = {
        code: competency.code,
        id: competency.id
      };
      controller.set('showPullOut', true);
      controller.set('isLoading', true);
      controller
        .getSearchLearningMapsContent(nodeInfo)
        .then(function(learningData) {
          let culcaqrCount = Ember.A();
          let culcaqrContents = Ember.A();
          let contentCountData = Ember.A();
          culcaqrCount = learningData.contents;
          culcaqrContents = learningData.learningMapsContent;
          let courseCount = culcaqrCount.course
            ? culcaqrCount.course.totalHitCount
            : 0;
          let unitCount = culcaqrCount.unit
            ? culcaqrCount.unit.totalHitCount
            : 0;
          let lessonCount = culcaqrCount.lesson
            ? culcaqrCount.lesson.totalHitCount
            : 0;
          let collectionCount = culcaqrCount.collection
            ? culcaqrCount.collection.totalHitCount
            : 0;
          let assessmentCount = culcaqrCount.assessment
            ? culcaqrCount.assessment.totalHitCount
            : 0;
          let resourceCount = culcaqrCount.resource
            ? culcaqrCount.resource.totalHitCount
            : 0;
          let questionCount = culcaqrCount.question
            ? culcaqrCount.question.totalHitCount
            : 0;
          let rubricCount = culcaqrCount.rubric
            ? culcaqrCount.rubric.totalHitCount
            : 0;

          contentCountData.push(
            Utils.getStructuredContentData(CONTENT_TYPES.COURSE, courseCount)
          );
          contentCountData.push(
            Utils.getStructuredContentData(CONTENT_TYPES.UNIT, unitCount)
          );
          contentCountData.push(
            Utils.getStructuredContentData(CONTENT_TYPES.LESSON, lessonCount)
          );
          contentCountData.push(
            Utils.getStructuredContentData(
              CONTENT_TYPES.ASSESSMENT,
              assessmentCount
            )
          );
          contentCountData.push(
            Utils.getStructuredContentData(
              CONTENT_TYPES.COLLECTION,
              collectionCount
            )
          );
          contentCountData.push(
            Utils.getStructuredContentData(
              CONTENT_TYPES.RESOURCE,
              resourceCount
            )
          );
          contentCountData.push(
            Utils.getStructuredContentData(
              CONTENT_TYPES.QUESTION,
              questionCount
            )
          );
          contentCountData.push(
            Utils.getStructuredContentData(CONTENT_TYPES.RUBRIC, rubricCount)
          );

          controller.set('contentCount', contentCountData);
          controller.set('isLoading', false);
          controller.set('signatureContents', learningData.signatureContents);
          controller.set('prerequisites', learningData.prerequisites);

          controller.set(
            'courseContent',
            culcaqrContents.course
              ? culcaqrContents.course.splice(0, 3)
              : culcaqrContents.course
          );
          controller.set(
            'unitContent',
            culcaqrContents.unit
              ? culcaqrContents.unit.splice(0, 3)
              : culcaqrContents.unit
          );
          controller.set(
            'lessonContent',
            culcaqrContents.lesson
              ? culcaqrContents.lesson.splice(0, 3)
              : culcaqrContents.lesson
          );
          controller.set(
            'resourceContent',
            culcaqrContents.resource.splice(0, 3)
          );
          controller.set(
            'collectionContent',
            culcaqrContents.collection.splice(0, 3)
          );
          controller.set(
            'assessmentContent',
            culcaqrContents.assessment.splice(0, 3)
          );
          controller.set(
            'questionContent',
            culcaqrContents.question.splice(0, 3)
          );
        });
    }
  },

  //---------------------------------------------------------------------------
  //Methods

  /**
   * Get Content count of search results
   * return hashed json of each content type count
   */
  getSearchContentCount(selectedDomainData) {
    let filters = selectedDomainData.filters;
    let selectedCategory = this.get('selectedCategory');
    let query = '*';
    let start = 1;
    let length = 3;
    const contentCountData = [];
    filters['flt.subjectClassification'] = selectedCategory;

    const resourceCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchResources(query, filters, start, length)
    );
    const questionCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchQuestions(query, filters, start, length)
    );
    const courseCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchCourses(query, filters, start, length)
    );
    const collectionCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchCollections(query, filters, start, length)
    );
    const assessmentCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchAssessments(query, filters, start, length)
    );
    const rubricCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchRubrics(query, filters, start, length)
    );
    const unitCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchUnits(query, filters, start, length)
    );
    const lessonsCountPromise = Ember.RSVP.resolve(
      this.get('searchService').searchLessons(query, filters, start, length)
    );

    return Ember.RSVP.hash({
      resource: resourceCountPromise,
      question: questionCountPromise,
      course: courseCountPromise,
      collection: collectionCountPromise,
      assessment: assessmentCountPromise,
      rubric: rubricCountPromise,
      unit: unitCountPromise,
      lesson: lessonsCountPromise
    }).then(function(culcaqrCount) {
      let courseCount = culcaqrCount.course
        ? culcaqrCount.course.get('hitCount')
        : 0;
      let unitCount = culcaqrCount.unit ? culcaqrCount.unit : 0;
      let lessonCount = culcaqrCount.lesson ? culcaqrCount.lesson : 0;
      let collectionCount = culcaqrCount.collection
        ? culcaqrCount.collection.get('hitCount')
        : 0;
      let assessmentCount = culcaqrCount.assessment
        ? culcaqrCount.assessment.get('hitCount')
        : 0;
      let resourceCount = culcaqrCount.resource
        ? culcaqrCount.resource.get('hitCount')
        : 0;
      let questionCount = culcaqrCount.question
        ? culcaqrCount.question.get('hitCount')
        : 0;
      let rubricCount = culcaqrCount.rubric ? culcaqrCount.rubric : 0;

      contentCountData.push(
        Utils.getStructuredContentData(CONTENT_TYPES.COURSE, courseCount)
      );
      contentCountData.push(
        Utils.getStructuredContentData(CONTENT_TYPES.UNIT, unitCount)
      );
      contentCountData.push(
        Utils.getStructuredContentData(CONTENT_TYPES.LESSON, lessonCount)
      );
      contentCountData.push(
        Utils.getStructuredContentData(
          CONTENT_TYPES.ASSESSMENT,
          assessmentCount
        )
      );
      contentCountData.push(
        Utils.getStructuredContentData(
          CONTENT_TYPES.COLLECTION,
          collectionCount
        )
      );
      contentCountData.push(
        Utils.getStructuredContentData(CONTENT_TYPES.RESOURCE, resourceCount)
      );
      contentCountData.push(
        Utils.getStructuredContentData(CONTENT_TYPES.QUESTION, questionCount)
      );
      contentCountData.push(
        Utils.getStructuredContentData(CONTENT_TYPES.RUBRIC, rubricCount)
      );
      return contentCountData;
    });
  },

  /**
   * Get Content count of search results
   * return hashed json of each content type conunt
   */
  getSearchLearningMapsContent(selectedNode) {
    let controller = this;
    controller.set('showMore', true);
    const learningMapsContent = Ember.RSVP.resolve(
      this.get('searchService').learningMapsContent(selectedNode, 3)
    );
    return Ember.RSVP.hash({
      learningMapsContent: learningMapsContent
    }).then(function(hash) {
      return hash.learningMapsContent;
    });
  }
});
