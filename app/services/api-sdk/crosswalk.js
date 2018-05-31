import Ember from 'ember';
import crosswalkAdapter from 'admin-dataview/adapters/crosswalk/crosswalk';

/**
 * Service to support the operation for crosswalkService
 *
 * @typedef {Object} crosswalkService
 */

export default Ember.Service.extend({

  crosswalkAdapter: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'crosswalkAdapter',
      crosswalkAdapter.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
  * @param subjectId
  * Method to fetch crosswalk data
  */

  getCrosswalkData: function(subjectId) {
    let service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('crosswalkAdapter').getCrosswalkData(subjectId)
        .then(function(response) {
          resolve(response);
        }, reject);
    });
  }
});
