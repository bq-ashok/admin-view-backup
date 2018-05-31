import Ember from 'ember';
import ConfigurationMixin from 'admin-dataview/mixins/configuration';
import ResourceModel from 'admin-dataview/models/resource/resource';
import QuestionModel from 'admin-dataview/models/question/question';
import CollectionModel from 'admin-dataview/models/collection/collection';
import AssessmentModel from 'admin-dataview/models/assessment/assessment';
import CourseModel from 'admin-dataview/models/course/course';
import TaxonomySerializer from 'admin-dataview/serializers/taxonomy/taxonomy';
import { DEFAULT_IMAGES, TAXONOMY_LEVELS } from 'admin-dataview/config/config';
import ProfileModel from 'admin-dataview/models/profile/profile';
import { getResourceFormat } from 'admin-dataview/utils/utils';

/**
 * Serializer to support Search functionality
 *
 * @typedef {Object} SearchSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {
  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Normalize the Search course response
   *
   * @param payload is the endpoint response in JSON format
   * @returns {Course[]}
   */
  normalizeSearchCourses: function(payload) {
    const serializer = this;
    let resultSet = Ember.Object.create({
      searchResults: Ember.A(),
      hitCount: payload.totalHitCount
    });
    if (Ember.isArray(payload.searchResults)) {
      let results = payload.searchResults.map(function(result) {
        return serializer.normalizeCourse(result);
      });
      resultSet.set('searchResults', results);
    }
    return resultSet;
  },

  /**
   * Normalizes a course
   * @param {*} result
   * @returns {Course}
   */
  normalizeCourse: function(result) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    const thumbnailUrl = result.thumbnail
      ? basePath + result.thumbnail
      : appRootPath + DEFAULT_IMAGES.COURSE;
    const taxonomyInfo =
      (result.taxonomy &&
        result.taxonomy.curriculum &&
        result.taxonomy.curriculum.curriculumInfo) ||
      [];
    return CourseModel.create(Ember.getOwner(this).ownerInjection(), {
      id: result.id,
      title: result.title,
      audience: result.audience || null,
      description: result.description,
      createdDate: result.addDate,
      thumbnailUrl: thumbnailUrl,
      lastModified: result.lastModified,
      lastModifiedBy: result.lastModifiedBy,
      subject: result.subjectBucket,
      taxonomySubject: result.taxonomy.subject || null,
      taxonomyCourse: result.taxonomy.course || null,
      taxonomyDomain: result.taxonomy.taxonomyDomain || null,
      subjectSequence: result.subjectSequence,
      isVisibleOnProfile: result.visibleOnProfile,
      isPublished: result.publishStatus === 'published',
      unitCount: result.unitCount,
      assessmentCount: result.assessmentCount,
      collectionCount: result.collectionCount,
      lessonCount: result.lessonCount,
      taxonomy: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyArray(taxonomyInfo, TAXONOMY_LEVELS.COURSE),
      owner: result.owner ? serializer.normalizeOwner(result.owner) : null,
      sequence: result.sequence,
      relevance: result.relevance,
      efficacy: result.efficacy,
      engagement: result.engagement,
      type: result.format
    });
  },

  /**
   * Normalizes a unit
   * @param {*} result
   * @returns {unit}
   */
  normalizeUnit: function(result) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    const thumbnailUrl = result.thumbnail
      ? basePath + result.thumbnail
      : appRootPath + DEFAULT_IMAGES.COLLECTION;
    const taxonomyInfo =
      (result.taxonomy &&
        result.taxonomy.curriculum &&
        result.taxonomy.curriculum.curriculumInfo) ||
      [];
    return CourseModel.create(Ember.getOwner(this).ownerInjection(), {
      id: result.id,
      title: result.title,
      description: result.description,
      createdDate: result.addDate,
      thumbnailUrl: thumbnailUrl,
      lastModified: result.lastModified,
      lastModifiedBy: result.lastModifiedBy,
      isVisibleOnProfile: result.visibleOnProfile,
      isPublished: result.publishStatus === 'published',
      assessmentCount: result.assessmentCount,
      collectionCount: result.collectionCount,
      lessonCount: result.lessonCount,
      standards: taxonomyInfo
        ? serializer
          .get('taxonomySerializer')
          .normalizeTaxonomyArray(taxonomyInfo, TAXONOMY_LEVELS.COURSE)
        : {},
      owner: result.owner ? serializer.normalizeOwner(result.owner) : null,
      sequence: result.sequence,
      relevance: result.relevance,
      efficacy: result.efficacy,
      engagement: result.engagement,
      type: result.format
    });
  },

  /**
   * Normalizes a lesson
   * @param {*} result
   * @returns {Course}
   */
  normalizeLesson: function(result) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    const thumbnailUrl = result.thumbnail
      ? basePath + result.thumbnail
      : appRootPath + DEFAULT_IMAGES.COLLECTION;
    return CourseModel.create(Ember.getOwner(this).ownerInjection(), {
      id: result.id,
      title: result.title,
      description: result.description,
      createdDate: result.addDate,
      thumbnailUrl: thumbnailUrl,
      lastModified: result.lastModified,
      lastModifiedBy: result.lastModifiedBy,
      isVisibleOnProfile: result.visibleOnProfile,
      isPublished: result.publishStatus === 'published',
      assessmentCount: result.assessmentCount,
      collectionCount: result.collectionCount,
      standards: null,
      owner: result.owner ? serializer.normalizeOwner(result.owner) : null,
      sequence: result.sequence,
      relevance: result.relevance,
      efficacy: result.efficacy,
      engagement: result.engagement,
      type: result.format
    });
  },

  nomalizeSearchResources: function(payload) {
    const serializer = this;
    let resultSet = Ember.Object.create({
      searchResults: Ember.A(),
      hitCount: payload.totalHitCount
    });
    if (Ember.isArray(payload.searchResults)) {
      let results = payload.searchResults.map(function(result) {
        return serializer.normalizeResource(result);
      });
      resultSet.set('searchResults', results);
    }
    return resultSet;
  },

  normalizeResource: function(resource) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const format = getResourceFormat(resource.contentSubFormat);
    const taxonomyInfo =
      (resource.taxonomySet &&
        resource.taxonomySet.curriculum &&
        resource.taxonomySet.curriculum.curriculumInfo) ||
      [];
    return ResourceModel.create(Ember.getOwner(this).ownerInjection(), {
      id: resource.gooruOid,
      title: resource.title,
      description: resource.description,
      format: format,
      url: resource.url,
      thumbnailUrl: resource.thumbnail
        ? basePath + resource.thumbnail
        : DEFAULT_IMAGES.RESOURCE,
      creator: resource.creator
        ? serializer.normalizeOwner(resource.creator)
        : null,
      owner: resource.user ? serializer.normalizeOwner(resource.user) : null,
      type: 'resource',
      standards: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyArray(taxonomyInfo),
      taxonomySubject: resource.taxonomySet
        ? resource.taxonomySet.subject
        : null,
      taxonomyCourse: resource.taxonomySet ? resource.taxonomySet.course : null,
      taxonomyDomain: resource.taxonomySet ? resource.taxonomySet.domain : null,
      publishStatus: resource.publishStatus,
      publisher: resource.publisher ? resource.publisher[0] : null,
      efficacy: resource.efficacy ? resource.efficacy : null,
      relevance: resource.relevance ? resource.relevance : null,
      engagement: resource.engagement ? resource.engagement : null
    });
  },

  /**
   * @function normalizeAggregatedResources
   * This function will handle the aggregated resource response
   */
  normalizeAggregatedResources: function(resourceData) {
    let normalizedResourceData = Ember.Object.create({
      resourceCount: {},
      hitCount: resourceData.stats.totalHitCount
    });
    if (Ember.isArray(resourceData.aggregations)) {
      let countByResourceType = {};
      resourceData.aggregations.map(resource => {
        countByResourceType[`${resource.key}`] = resource.doc_count;
        return countByResourceType;
      });
      normalizedResourceData.set('resourceCount', countByResourceType);
    }
    return normalizedResourceData;
  },

  /**
   * @function normalizeAggregatedQuestions
   * This function will handle the aggregated question response
   */
  normalizeAggregatedQuestions: function(questionData) {
    let normalizedQuestionData = Ember.Object.create({
      questionCount: {},
      hitCount: questionData.stats.totalHitCount
    });
    if (Ember.isArray(questionData.aggregations)) {
      let countByQuestionType = {};
      questionData.aggregations.map(question => {
        countByQuestionType[`${question.key}`] = question.doc_count;
        return countByQuestionType;
      });
      normalizedQuestionData.set('questionCount', countByQuestionType);
    }
    return normalizedQuestionData;
  },

  /**
   * Normalize the Search collections response
   *
   * @param payload is the endpoint response in JSON format
   * @returns {Collection[]}
   */
  normalizeSearchCollection: function(payload) {
    const serializer = this;
    let resultSet = Ember.Object.create({
      searchResults: Ember.A(),
      hitCount: payload.totalHitCount
    });
    if (Ember.isArray(payload.searchResults)) {
      let results = payload.searchResults.map(function(result) {
        return serializer.normalizeCollection(result);
      });
      resultSet.set('searchResults', results);
    }
    return resultSet;
  },

  /**
   * Normalize a collection
   * @param {*} collectionData
   * @returns {Collection}
   */
  normalizeCollection: function(collectionData) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const userBasePath = serializer.get('session.cdnUrls.user');

    const thumbnailUrl = collectionData.thumbnail
      ? basePath + collectionData.thumbnail
      : DEFAULT_IMAGES.COLLECTION;
    const userThumbnailUrl = collectionData.userProfileImage
      ? userBasePath + collectionData.userProfileImage
      : DEFAULT_IMAGES.USER_PROFILE;
    const creatorThumbnailUrl = collectionData.creatorProfileImage
      ? userBasePath + collectionData.creatorProfileImage
      : DEFAULT_IMAGES.USER_PROFILE;
    const taxonomyInfo =
      (collectionData.taxonomySet &&
        collectionData.taxonomySet.curriculum &&
        collectionData.taxonomySet.curriculum.curriculumInfo) ||
      [];

    const course = collectionData.course || {};
    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: collectionData.id,
      title: collectionData.title,
      description: collectionData.description,
      type: collectionData.type ? collectionData.type : collectionData.format,
      thumbnailUrl: thumbnailUrl,
      standards: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyArray(taxonomyInfo),
      publishStatus: collectionData.publishStatus,
      learningObjectives: collectionData.languageObjective,
      resourceCount: collectionData.resourceCount || 0,
      questionCount: collectionData.questionCount || 0,
      remixCount: collectionData.scollectionRemixCount || 0,
      course: course.title,
      courseId: course.id,
      isVisibleOnProfile: collectionData.profileUserVisibility,
      owner: ProfileModel.create({
        id: collectionData.gooruUId,
        firstName: collectionData.userFirstName,
        lastName: collectionData.userLastName,
        avatarUrl: userThumbnailUrl,
        username: collectionData.usernameDisplay
      }),
      creator: ProfileModel.create({
        id: collectionData.creatorId,
        firstName: collectionData.creatorFirstname,
        lastName: collectionData.creatorLastname,
        avatarUrl: creatorThumbnailUrl,
        username: collectionData.creatornameDisplay
      }),
      taxonomySet: collectionData.taxonomySet,
      createdDate: collectionData.addDate,
      collaboratorIDs: collectionData.collaboratorIds,
      grade: collectionData.grade,
      instructionalModel: collectionData.instructionalMethod,
      lastModified: collectionData.lastModified,
      lastModifiedBy: collectionData.lastModifiedBy,
      license: collectionData.license,
      audience: collectionData.audience,
      keyPoints: collectionData.keyPoints,
      efficacy: collectionData.efficacy ? collectionData.efficacy : null,
      relevance: collectionData.relevance ? collectionData.relevance : null,
      engagement: collectionData.engagement ? collectionData.engagement : null
    });
  },

  /**
   * Normalize the Search assessments response
   *
   * @param payload is the endpoint response in JSON format
   * @returns {Assessment[]}
   */
  normalizeSearchAssessments: function(payload) {
    const serializer = this;
    let resultSet = Ember.Object.create({
      searchResults: Ember.A(),
      hitCount: payload.totalHitCount
    });
    if (Ember.isArray(payload.searchResults)) {
      let results = payload.searchResults.map(function(result) {
        return serializer.normalizeAssessment(result);
      });
      resultSet.set('searchResults', results);
    }
    return resultSet;
  },

  /**
   * Normalize an assessment
   * @param {*} assessmentData
   * @returns {Assessment}
   */
  normalizeAssessment: function(assessmentData) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const userBasePath = serializer.get('session.cdnUrls.user');
    const thumbnailUrl = assessmentData.thumbnail
      ? basePath + assessmentData.thumbnail
      : DEFAULT_IMAGES.ASSESSMENT;
    const ownerThumbnailUrl = assessmentData.userProfileImage
      ? userBasePath + assessmentData.userProfileImage
      : DEFAULT_IMAGES.USER_PROFILE;
    const creatorThumbnailUrl = assessmentData.creatorProfileImage
      ? userBasePath + assessmentData.creatorProfileImage
      : DEFAULT_IMAGES.USER_PROFILE;
    const taxonomyInfo =
      (assessmentData.taxonomySet &&
        assessmentData.taxonomySet.curriculum &&
        assessmentData.taxonomySet.curriculum.curriculumInfo) ||
      [];
    const course = assessmentData.course || {};
    return AssessmentModel.create(Ember.getOwner(this).ownerInjection(), {
      id: assessmentData.id,
      title: assessmentData.title,
      description: assessmentData.description,
      type: assessmentData.type ? assessmentData.type : assessmentData.format,
      thumbnailUrl: thumbnailUrl,
      standards: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyArray(taxonomyInfo),
      publishStatus: assessmentData.publishStatus,
      learningObjectives: assessmentData.languageObjective,
      resourceCount: assessmentData.resourceCount
        ? Number(assessmentData.resourceCount)
        : 0,
      questionCount: assessmentData.questionCount
        ? Number(assessmentData.questionCount)
        : 0,
      remixCount: assessmentData.scollectionRemixCount || 0,
      course: course.title,
      courseId: course.id,
      isVisibleOnProfile: assessmentData.profileUserVisibility,
      owner: ProfileModel.create({
        id: assessmentData.gooruUId,
        firstName: assessmentData.userFirstName,
        lastName: assessmentData.userLastName,
        avatarUrl: ownerThumbnailUrl,
        username: assessmentData.usernameDisplay
      }),
      creator: ProfileModel.create({
        id: assessmentData.creatorId,
        firstName: assessmentData.creatorFirstname,
        lastName: assessmentData.creatorLastname,
        avatarUrl: creatorThumbnailUrl,
        username: assessmentData.creatornameDisplay
      }),
      taxonomySet: assessmentData.taxonomySet,
      createdDate: assessmentData.addDate,
      collaboratorIDs: assessmentData.collaboratorIds,
      grade: assessmentData.grade,
      instructionalModel: assessmentData.instructionalMethod,
      lastModified: assessmentData.lastModified,
      lastModifiedBy: assessmentData.lastModifiedBy,
      license: assessmentData.license,
      audience: assessmentData.audience,
      keyPoints: assessmentData.keyPoints,
      efficacy: assessmentData.efficacy ? assessmentData.efficacy : null,
      relevance: assessmentData.relevance ? assessmentData.relevance : null,
      engagement: assessmentData.engagement ? assessmentData.engagement : null
    });
  },

  normalizeSearchQuestions: function(payload) {
    const serializer = this;
    let resultSet = Ember.Object.create({
      searchResults: Ember.A(),
      hitCount: payload.totalHitCount
    });
    if (Ember.isArray(payload.searchResults)) {
      let results = payload.searchResults.map(function(result) {
        return serializer.normalizeQuestion(result);
      });
      resultSet.set('searchResults', results);
    }
    return resultSet;
  },

  /**
   * Normalizes a question
   * @param {*} result
   * @returns {Question}
   */
  normalizeQuestion: function(questionData) {
    const serializer = this;
    const taxonomyInfo =
      (questionData.taxonomySet &&
        questionData.taxonomySet.curriculum &&
        questionData.taxonomySet.curriculum.curriculumInfo) ||
      [];
    const format = QuestionModel.normalizeQuestionType(
      questionData.contentSubFormat
    );
    return QuestionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: questionData.gooruOid,
      title: questionData.title,
      description: questionData.description
        ? questionData.description
        : questionData.text,
      type: questionData.resourceFormat
        ? questionData.resourceFormat.value
        : null,
      format: format,
      publisher: null, //TODO missing publisher at API response,
      thumbnailUrl: questionData.thumbnail,
      creator: questionData.creator
        ? serializer.normalizeOwner(questionData.creator)
        : null,
      owner: questionData.user
        ? serializer.normalizeOwner(questionData.user)
        : null,
      standards: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyArray(taxonomyInfo),
      taxonomySubject: questionData.taxonomySet
        ? questionData.taxonomySet.subject
        : null,
      taxonomyCourse: questionData.taxonomySet
        ? questionData.taxonomySet.course
        : null,
      taxonomyDomain: questionData.taxonomySet
        ? questionData.taxonomySet.domain
        : null,
      efficacy: questionData.efficacy ? questionData.efficacy : null,
      relevance: questionData.relevance ? questionData.relevance : null,
      engagement: questionData.engagement ? questionData.engagement : null,
      contentSubFormat: questionData.contentSubFormat
    });
  },

  /**
   * Normalizes a question
   * @param {*} result
   * @returns {Question}
   */
  normalizeSearchlearningMapsContent: function(learningMapsContent) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const signatureData = learningMapsContent.signatureContents;
    if (signatureData && signatureData.assessments) {
      signatureData.assessments.forEach(function(item) {
        item.thumbnail = item.thumbnail
          ? basePath + item.thumbnail
          : DEFAULT_IMAGES.ASSESSMENT;
      });
    }
    if (signatureData && signatureData.collections) {
      signatureData.collections.forEach(function(item) {
        item.thumbnail = item.thumbnail
          ? basePath + item.thumbnail
          : DEFAULT_IMAGES.COLLECTION;
      });
    }

    const returnObjects = {
      owner: Ember.getOwner(this).ownerInjection(),
      title: learningMapsContent.title,
      code: learningMapsContent.code,
      gutCode: learningMapsContent.gutCode,
      contents: learningMapsContent.contents,
      prerequisites: learningMapsContent.prerequisites,
      subject: learningMapsContent.subject,
      course: learningMapsContent.course,
      domain: learningMapsContent.domain,
      signatureContents: signatureData,
      learningMapsContent: serializer.normalizeSearchLearningMapsContentInfo(
        learningMapsContent.contents
      )
    };
    return returnObjects;
  },

  /**
   * @function normalizeSearchLearningMapsContentInfo
   * Serialize each content type from the learning map API
   */
  normalizeSearchLearningMapsContentInfo(contents) {
    let serializer = this;
    let serializedContentData = {};
    let assessmentData = [];
    let collectionData = [];
    let courseData = [];
    let resourceData = [];
    let questionData = [];
    let unitData = [];
    let lessonData = [];

    if (contents.assessment) {
      contents.assessment.searchResults.map(assessment => {
        let assessmentInfo = serializer.normalizeAssessment(assessment);
        assessmentInfo.id = assessment.id;
        assessmentInfo.description = assessment.learningObjective;
        assessmentInfo.creator = serializer.normalizeOwner(assessment.creator);
        assessmentInfo.owner = serializer.normalizeOwner(assessment.user);
        assessmentInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            assessment.taxonomy,
            TAXONOMY_LEVELS.ASSESSMENT
          );
        assessmentData.push(assessmentInfo);
      });
    }

    if (contents.collection) {
      contents.collection.searchResults.map(collection => {
        let collectionInfo = serializer.normalizeCollection(collection);
        collectionInfo.id = collection.id;
        collectionInfo.description = collection.learningObjective;
        collectionInfo.creator = serializer.normalizeOwner(collection.creator);
        collectionInfo.owner = serializer.normalizeOwner(collection.user);
        collectionInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            collection.taxonomy,
            TAXONOMY_LEVELS.COLLECTION
          );
        collectionData.push(collectionInfo);
      });
    }

    if (contents.course) {
      contents.course.searchResults.map(course => {
        let courseInfo = serializer.normalizeCourse(course);
        courseInfo.id = course.id;
        courseInfo.description = course.description;
        courseInfo.creator = course.creator
          ? serializer.normalizeOwner(course.creator)
          : {};
        courseInfo.owner = course.owner
          ? serializer.normalizeOwner(course.owner)
          : {};
        courseInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            course.taxonomy,
            TAXONOMY_LEVELS.COURSE
          );
        courseData.push(courseInfo);
      });
    }

    if (contents.resource) {
      contents.resource.searchResults.map(resource => {
        let resourceInfo = serializer.normalizeResource(resource);
        resourceInfo.id = resource.id;
        resourceInfo.description = resource.description;
        resourceInfo.creator = resource.creator
          ? serializer.normalizeOwner(resource.creator)
          : {};
        resourceInfo.owner = resource.user
          ? serializer.normalizeOwner(resource.user)
          : {};
        resourceInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            resource.taxonomy,
            TAXONOMY_LEVELS.RESOURCE
          );
        resourceData.push(resourceInfo);
      });
    }

    if (contents.question) {
      contents.question.searchResults.map(question => {
        let questionInfo = serializer.normalizeQuestion(question);
        questionInfo.id = question.id;
        questionInfo.description = question.description;
        questionInfo.creator = serializer.normalizeOwner(question.creator);
        questionInfo.owner = serializer.normalizeOwner(question.user);
        questionInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            question.taxonomy,
            TAXONOMY_LEVELS.QUESTION
          );
        questionData.push(questionInfo);
      });
    }

    if (contents.unit) {
      contents.unit.searchResults.map(unit => {
        let unitInfo = serializer.normalizeUnit(unit);
        unitInfo.id = unit.id;
        unitInfo.description = unit.learningObjective;
        unitInfo.creator = unit.creator
          ? serializer.normalizeOwner(unit.creator)
          : {};
        unitInfo.owner = unit.owner
          ? serializer.normalizeOwner(unit.owner)
          : {};
        unitInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            unitInfo.taxonomy,
            TAXONOMY_LEVELS.QUESTION
          );
        unitData.push(unitInfo);
      });
    }

    if (contents.lesson) {
      contents.lesson.searchResults.map(lesson => {
        let lessonInfo = serializer.normalizeLesson(lesson);
        lessonInfo.id = lesson.id;
        lessonInfo.description = lesson.learningObjective;
        lessonInfo.creator = lesson.creator
          ? serializer.normalizeOwner(lesson.creator)
          : {};
        lessonInfo.owner = lesson.owner
          ? serializer.normalizeOwner(lesson.owner)
          : {};
        lessonInfo.standards = serializer
          .get('taxonomySerializer')
          .normalizeLearningMapsTaxonomyArray(
            lessonInfo.taxonomy,
            TAXONOMY_LEVELS.QUESTION
          );
        lessonData.push(lessonInfo);
      });
    }

    serializedContentData.assessment = assessmentData;
    serializedContentData.collection = collectionData;
    serializedContentData.course = courseData;
    serializedContentData.resource = resourceData;
    serializedContentData.question = questionData;
    serializedContentData.unit = unitData;
    serializedContentData.lesson = lessonData;
    return serializedContentData;
  },

  /**
   * Normalizes owner
   * @param ownerData
   * @returns {Profile}
   */
  normalizeOwner: function(ownerData) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.user');
    const thumbnailUrl = ownerData.profileImage
      ? basePath + ownerData.profileImage
      : DEFAULT_IMAGES.USER_PROFILE;

    return ProfileModel.create(Ember.getOwner(this).ownerInjection(), {
      id: ownerData.gooruUId || ownerData.id,
      firstName: ownerData.firstName,
      lastName: ownerData.lastName,
      username: ownerData.usernameDisplay,
      avatarUrl: thumbnailUrl
    });
  },

  /**
   * Normalize the Search response
   *
   * @param payload is the endpoint response in JSON format
   * @returns {contentCount}
   */
  normalizeSearchContentCount: function(payload) {
    let totalHitCount = payload ? payload.totalHitCount : null;
    return totalHitCount;
  },

  /**
   * Normalize the Learning Map Competency
   *
   * @param payload is the endpoint response in JSON format
   * @returns {LearningMapCompetencyData}
   */
  normalizeSearchlearningMapCompetency: function(payload) {
    let serializer = this;
    let microCompetencyData = [];
    let competencyData = [];
    let serializedCompetencyData = {
      totalHitCount: 0,
      competencyInfo: []
    };
    let microComptencyLevelPattern = 'learning_target_level_';
    if (payload) {
      serializedCompetencyData.totalHitCount = payload.totalHitCount || 0;
      payload.stats.map(competency => {
        if (competency.type.includes(microComptencyLevelPattern)) {
          ///micro-competency
          let storedMicroCompetencies =
            microCompetencyData[`${competency.parentId}`] || [];
          storedMicroCompetencies[
            competency.sequenceId - 1
          ] = serializer.normalizeLearningMapCompetencyData(competency);
          microCompetencyData[
            `${competency.parentId}`
          ] = storedMicroCompetencies;
        } else {
          competencyData.push(
            serializer.normalizeLearningMapCompetencyData(competency)
          );
        }
      });
      serializedCompetencyData.competencyInfo = serializer.sequenceLearningMapCompetencyItems(
        competencyData,
        microCompetencyData
      );
    }
    return serializedCompetencyData;
  },

  /**
   * @function sequenceLearningMapCompetencyItems
   * To sequence the separated competency and micro-competency data
   * @param competencyData
   * @param microCompetencyData
   * @return sequencedCompetencyData
   */
  sequenceLearningMapCompetencyItems(competencyData, microCompetencyData) {
    let sequencedCompetencyData = [];
    competencyData.map(competency => {
      let microCompetencyInfo = null;
      sequencedCompetencyData.push(competency);
      microCompetencyInfo = microCompetencyData[`${competency.id}`] || null;
      if (microCompetencyInfo) {
        sequencedCompetencyData = sequencedCompetencyData.concat(
          microCompetencyInfo
        );
      }
    });
    return sequencedCompetencyData;
  },

  /**
   * Restore missing competency properties with default values
   */
  normalizeLearningMapCompetencyData(competency) {
    //Add missing data with empty content
    competency.prerequisites = competency.prerequisites || [];
    competency.title = competency.title || '';
    competency.code = competency.code || '';
    return competency;
  }
});
