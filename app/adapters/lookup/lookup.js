import Ember from 'ember';

/**
 * Adapter to support the Lookup API 3.0 integration
 *
 * @typedef {Object} LookupAdapter
 */
export default Ember.Object.extend({
  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/lookups',

  /**
   * Gets the audience list information
   * @returns {Promise.<[]>}
   */
  readAudiences() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/audience`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the depth of knowledge list information
   * @returns {Promise.<[]>}
   */
  readDepthOfKnowledgeItems() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/dok`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the depth of knowledge list information
   * @returns {Promise.<[]>}
   */
  readLicenses() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/licenses`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   * Gets the 21st Century Skills list information
   * @returns {Promise.<[]>}
   */
  readCenturySkills() {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/21-century-skills`;
    const options = {
      type: 'GET',
      headers: adapter.defineHeaders()
    };
    return Ember.$.ajax(url, options);
  },

  /**
   *
   * @returns {{Authorization: string}}
   */
  defineHeaders() {
    return {
      Authorization: `Token ${this.get('session.accessToken')}`
    };
  }
});
