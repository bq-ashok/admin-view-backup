import Ember from 'ember';
import SearchSerializer from 'admin-dataview/serializers/search/search';
import SearchAdapter from 'admin-dataview/adapters/search/search';

/**
 * Service to support the Search of Collections and Resources
 *
 * @typedef {Object} SearchService
 */
export default Ember.Service.extend({
  searchSerializer: null,

  searchAdapter: null,

  /**
   * Make a cache of competency content and make use of offset as well to avoid recursive API
   */
  competencyContentContainer: null,

  init: function() {
    this._super(...arguments);
    this.set('competencyContentContainer', []);
    this.set(
      'searchSerializer',
      SearchSerializer.create(Ember.getOwner(this).ownerInjection())
    );
    this.set(
      'searchAdapter',
      SearchAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Search collections
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Collection[]>}
   */
  searchCollections: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchCollections(query, filters, start, length)
        .then(function(response) {
          resolve(
            service.get('searchSerializer').normalizeSearchCollection(response)
          );
        }, reject);
    });
  },

  /**
   * Search assessments
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Assessment[]>}
   */
  searchAssessments: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchAssessments(query, filters, start, length)
        .then(function(response) {
          resolve(
            service.get('searchSerializer').normalizeSearchAssessments(response)
          );
        }, reject);
    });
  },

  /**
   * Search Resources
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Resource[]>}
   */
  searchResources: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchResources(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service.get('searchSerializer').nomalizeSearchResources(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search Resources
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Resource[]>}
   */
  searchAggregatedResources: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchResources(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeAggregatedResources(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search Questions
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Question[]>}
   */
  searchAggregatedQuestions: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchQuestions(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeAggregatedQuestions(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search Questions
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Question[]>}
   */
  searchQuestions: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchQuestions(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service.get('searchSerializer').normalizeSearchQuestions(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search courses
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Course[]>}
   */
  searchCourses: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchCourses(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service.get('searchSerializer').normalizeSearchCourses(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search Rubrics
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Rubric[]>}
   */
  searchRubrics: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchRubrics(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeSearchContentCount(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search Units
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Unit[]>}
   */
  searchUnits: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchUnits(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeSearchContentCount(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * Search Lessons
   * @param  {String} query
   * @param  {Object} filters
   * @param  {Number} start
   * @param  {Number} length
   * @return {Promise.<Lesson[]>}
   */
  searchLessons: function(query, filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchLessons(query, filters, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeSearchContentCount(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  learningMapsContent: function(filters, length, start) {
    const service = this;
    let competencyContentContainer = service.get('competencyContentContainer');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let isCompetencyContentAvailable = competencyContentContainer[
        `${filters.id}`
      ]
        ? competencyContentContainer[`${filters.id}`][start] || null
        : null;
      if (isCompetencyContentAvailable) {
        resolve(isCompetencyContentAvailable);
      } else {
        service
          .get('searchAdapter')
          .learningMapsContent(filters, length, start)
          .then(
            function(response) {
              let normalizedCompetencyContent = service
                .get('searchSerializer')
                .normalizeSearchlearningMapsContent(response);
              let fetchedCompetencyContent =
                competencyContentContainer[`${filters.id}`] || [];
              fetchedCompetencyContent[start] = normalizedCompetencyContent;
              competencyContentContainer[
                `${filters.id}`
              ] = fetchedCompetencyContent;
              service.set(
                'competencyContentContainer',
                competencyContentContainer
              );
              resolve(normalizedCompetencyContent);
            },
            function(error) {
              reject(error);
            }
          );
      }
    });
  },

  fetchLearningMapCompetency: function(filters, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .fetchLearningMapCompetency(filters, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeSearchlearningMapCompetency(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  },

  /**
   * @function searchLearningMapComptency
   * Method to search learning map competencies based on the search term
   */
  searchLearningMapCompetency(q, start, length) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service
        .get('searchAdapter')
        .searchLearningMapCompetency(q, start, length)
        .then(
          function(response) {
            resolve(
              service
                .get('searchSerializer')
                .normalizeSearchlearningMapCompetency(response)
            );
          },
          function(error) {
            reject(error);
          }
        );
    });
  }
});
