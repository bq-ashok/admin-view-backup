import Ember from 'ember';
import Utils from 'admin-dataview/utils/taxonomy';
import { getSearchFilterTextBySubjectName } from 'admin-dataview/utils/utils';
import { CONTENT_TYPES, TAXONOMY_LEVELS } from 'admin-dataview/config/config';

export default Ember.Controller.extend({
  //------------------------------------------------------------------------
  //Dependencies

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  /**
   * Search service to fetch content details
   */
  searchService: Ember.inject.service('api-sdk/search'),

  /**
   * activities service to fetch content details
   */
  activitiesService: Ember.inject.service('api-sdk/activities'),

  //-------------------------------------------------------------------------
  //Properties

  showPullOut: false,

  taxonomyTreeViewData: null,

  subjects: null,

  /**
   * Content count of the selected node
   */
  contentCount: null,

  /**
   * Slected node data
   */
  nodeData: null,

  /**
   * is competency level node or not
   */
  isCompetencyNode: false,

  /**
   * Show loading spinner
   */
  isLoading: true,

  /**
   * It will maintain value of number of times taxonomy subject category was choosen.
   * @type {Number}
   */
  reloadCount: 0,

  defaultTaxonomyTreeViewData: Ember.computed(function() {
    let data = Ember.Object.create({
      name: 'Gooru',
      type: 'root',
      id: 'GDT',
      children: Ember.A()
    });
    return data;
  }),

  onChange: Ember.observer('subjects', function() {
    let subjects = this.get('subjects');
    this.parseTaxonomyData(
      subjects,
      this.get('defaultTaxonomyTreeViewData'),
      true
    );
    let childNodes = this.get('taxonomyTreeViewData').get('children');
    subjects.forEach(subject => {
      let targetNode = childNodes.findBy('id', subject.get('id'));
      this.parseTaxonomyData(subject.get('courses'), targetNode, true);
    });
  }),

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered  when node get clicked from tree node.
     * @param  {Object} d selected node
     * @param  {Object} component
     */
    onClickTaxonomyNode(node, component) {
      let controller = this;
      controller.set('showPullOut', false);
      let taxonomyTreeViewData = controller.get('taxonomyTreeViewData');
      let id = node.data.id;
      if (node.depth === 1) {
        let subjectNodes = taxonomyTreeViewData.get('children');
        let subject = subjectNodes.findBy('id', id);
        let courseNodes = subject.get('children');
        let course = courseNodes.get(0);
        let domainNodes = course.get('childData');
        if (!domainNodes) {
          controller.renderCourseDomainsData(node).then(function() {
            component.updateData(node, courseNodes);
          });
        } else {
          component.updateData(node, courseNodes);
        }
      } else if (node.depth === 2) {
        let subjectNodes = taxonomyTreeViewData.get('children');
        let subject = subjectNodes.findBy('id', Utils.getSubjectId(id));
        let courseNodes = subject.get('children');
        let course = courseNodes.findBy('id', Utils.getCourseId(id));
        let domainNodes = course.get('childData');
        let domainNode = domainNodes.get(0);
        if (!domainNode.get('childData')) {
          controller.renderDomainCodesData(node).then(function() {
            component.updateData(node, domainNodes);
          });
        } else {
          component.updateData(node, domainNodes);
        }
      } else if (node.depth === 3) {
        let subjectNodes = taxonomyTreeViewData.get('children');
        let subject = subjectNodes.findBy('id', Utils.getSubjectId(id));
        let courseNodes = subject.get('children');
        let course = courseNodes.findBy('id', Utils.getCourseId(id));
        let domainNodes = course.get('childData');
        let domainNode = domainNodes.findBy('id', id);
        let standardNodes = domainNode.get('childData');
        component.updateData(node, standardNodes);
      } else if (node.depth === 4) {
        let subjectNodes = taxonomyTreeViewData.get('children');
        let subject = subjectNodes.findBy('id', Utils.getSubjectId(id));
        let courseNodes = subject.get('children');
        let course = courseNodes.findBy('id', Utils.getCourseId(id));
        let domainNodes = course.get('childData');
        let domainNode = domainNodes.findBy('id', Utils.getDomainId(id));
        let standardNodes = domainNode.get('childData');
        let standardNode = standardNodes.findBy('id', id);
        let microStandardNodes = standardNode.get('childData');
        component.updateData(node, microStandardNodes);
      }
    },

    /**
     * Action triggered when clicking more info in each node
     */
    onClickNodeMoreInfo(node) {
      let controller = this;
      let nodeDepth = node.depth;
      let nodeInfo = Utils.getNodeInfo(node);
      let nodeDescription = nodeInfo.title ? nodeInfo.title : null;
      let selectedNodeData = {
        type: nodeInfo.type,
        parent: nodeInfo.parent,
        name: node.data.name,
        code: node.data.code,
        searchValue: nodeInfo.searchValue,
        description: nodeDescription,
        filters: nodeInfo.filters,
        id: nodeInfo.id
      };
      controller.set(
        'isCompetencyNode',
        nodeInfo.type === TAXONOMY_LEVELS.STANDARD
      );
      controller.set('nodeData', selectedNodeData);
      controller.set('isLoading', true);
      controller.set('showPullOut', true);
      if (nodeDepth < 4) {
        controller
          .getSearchContentCount(selectedNodeData)
          .then(function(contentCount) {
            controller.set('contentCount', contentCount);
            controller.set('isLoading', false);
          });
      }

      controller
        .getSearchLearningMapsContent(selectedNodeData)
        .then(function(learning) {
          let culcaqrCount = Ember.A();
          let contentCountData = Ember.A();
          culcaqrCount = learning.contents;
          if (nodeDepth >= 4) {
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
          }

          controller.set('isLoading', false);
          controller.set('signatureContents', learning.signatureContents);
          controller.set('prerequisites', learning.prerequisites);
        });
    },
    /**
     * Action get triggered when subject category is choosen
     * @param  {Object} category
     */
    onChooseCategory(category) {
      this.set('showPullOut', false);
      this.send('chooseCategory', category);
    }
  },

  //-------------------------------------------------------------------------
  //Methods

  init() {
    this._super(...arguments);
    this.set('taxonomyTreeViewData', this.get('defaultTaxonomyTreeViewData'));
  },

  parseTaxonomyData(data, targetData, pushDataToChild) {
    let controller = this;
    let childData = Ember.A();
    data.forEach(item => {
      childData.pushObject(controller.createNode(item));
    });
    if (pushDataToChild) {
      targetData.set('children', childData);
    } else {
      targetData.set('childData', childData);
    }

    if (childData.length > 0) {
      targetData.set('hasChild', true);
    } else {
      targetData.set('hasChild', false);
    }
  },

  renderCourseDomainsData(node) {
    let id = node.data.id;
    let controller = this;
    let subjects = controller.get('subjects');
    let subject = subjects.findBy('id', id);
    let courses = subject.get('courses');
    let promises = Ember.A();
    courses.forEach(course => {
      promises.pushObject(
        controller
          .get('taxonomyService')
          .getCourseDomains(subject, course.get('id'))
      );
    });

    return Ember.RSVP.all(promises).then(function() {
      let subjectNodes = controller.get('taxonomyTreeViewData').get('children');
      let subjectNode = subjectNodes.findBy('id', id);
      let childNodes = subjectNode.get('children');
      courses.forEach(course => {
        let targetNode = childNodes.findBy('id', course.get('id'));
        controller.parseTaxonomyData(course.get('children'), targetNode, false);
      });
    });
  },

  renderDomainCodesData(node) {
    let controller = this;
    let id = node.data.id;
    let subjects = controller.get('subjects');
    let subjectId = Utils.getSubjectId(id);
    let courseId = Utils.getCourseId(id);
    let subject = subjects.findBy('id', subjectId);
    let course = subject.get('courses').findBy('id', courseId);
    let domains = course.get('children');
    let promises = Ember.A();
    domains.forEach(domain => {
      promises.pushObject(
        controller
          .get('taxonomyService')
          .getDomainCodes(subject, courseId, domain.get('id'))
      );
    });
    return Ember.RSVP.all(promises).then(function() {
      let courseNodes = controller.get('taxonomyTreeViewData').get('children');
      let courseNode = courseNodes.findBy('id', subjectId);
      let domainNodes = courseNode.get('children');
      let domainNode = domainNodes.findBy('id', courseId);
      let childNodes = domainNode.get('childData');
      domains.forEach(domain => {
        let domainId = domain.get('id');
        let targetNode = childNodes.findBy('id', domainId);

        controller.renderStandardCodes(domain.get('children'), targetNode);
      });
    });
  },

  renderStandardCodes(data, targetNode) {
    let controller = this;
    data = data.objectAt(0);
    let standards = data.get('children');
    let children = Ember.A();
    if (standards && standards.length > 0) {
      standards.forEach(standard => {
        let standardNode = controller.createNode(standard, false);
        let standardChildNodes = standard.get('children');
        if (standardChildNodes && standardChildNodes.length > 0) {
          let microStandardNodes = standardChildNodes[0];
          microStandardNodes = microStandardNodes.get('children');
          if (microStandardNodes && microStandardNodes.length > 0) {
            let standardChildNode = Ember.A();
            microStandardNodes.forEach(microStandard => {
              standardChildNode.pushObject(
                controller.createNode(microStandard, false)
              );
            });
            standardNode.set('childData', standardChildNode);
            if (standardChildNode.length > 0) {
              standardNode.set('hasChild', true);
            } else {
              standardNode.set('hasChild', false);
            }
          }
        }
        children.pushObject(standardNode);
      });
      targetNode.set('childData', children);
      if (children.length > 0) {
        targetNode.set('hasChild', true);
      } else {
        targetNode.set('hasChild', false);
      }
    }
  },

  createNode(data, isShowDisplayCode = false) {
    let node = Ember.Object.create({
      id: data.id,
      code: data.code,
      name: isShowDisplayCode ? data.code : data.title,
      title: data.title,
      children: null
    });
    return node;
  },

  /**
   * Get Content count of search results
   * return hashed json of each content type count
   */
  getSearchContentCount(selectedNode) {
    let filters = selectedNode.filters;
    let selectedCategory = this.get('selectedCategory');
    let query = '*';
    let start = 1;
    let length = 3;
    const contentCountData = [];

    //TODO shouldn't handle it manually, just a quick fix to fetch search results
    filters['flt.subjectName'] =
      selectedNode.type === 'subject'
        ? getSearchFilterTextBySubjectName(selectedNode.name)
        : '';
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
    const learningMapsContent = Ember.RSVP.resolve(
      this.get('searchService').learningMapsContent(selectedNode)
    );
    return Ember.RSVP.hash({
      learningMapsContent: learningMapsContent
    }).then(function(hash) {
      return hash.learningMapsContent;
    });
  }
});
