import Ember from 'ember';
import { capitalizeString } from 'admin-dataview/utils/utils';
export default Ember.Component.extend({
  //------------------------------------------------------------------------
  //Dependency
  /**
   * @requires service:profile
   */
  profileService: Ember.inject.service('api-sdk/profile'),

  // --------------------------------------------------------------------------
  // Attributes

  classNames: ['user-profile-modal'],

  // --------------------------------------------------------------------------
  // Events

  init: function() {
    let component = this;
    component._super(...arguments);
    let user = component.get('model.user');
    component.set('citizenship', user.citizenship.toFixed(2));
    component.set('authority', user.authority.toFixed(2));
    component.set('reputation', user.reputation.toFixed(2));
    let userId = user.userId;
    return Ember.RSVP.hash({
      userGrades: this.get('profileService').getUserGrades(userId),
      userPrefsCurators: this.get('profileService').getUserPrefsCurators(
        userId
      ),
      userPrefsProviders: this.get('profileService').getUserPrefsProviders(
        userId
      ),
      userPrefsContent: this.get('profileService').getUserPrefsContent(userId)
    }).then(
      ({
        userGrades,
        userPrefsCurators,
        userPrefsProviders,
        userPrefsContent
      }) => {
        component.set('userProfile', user);
        component.set('userGrades', userGrades);
        component.set('userPrefsContent', userPrefsContent);
        component.set('userPrefsProviders', userPrefsProviders);
        component.set('userPrefsCurators', userPrefsCurators);
      }
    );
  },

  // --------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when user click on the down arrow icon
     */
    onShowPanel: function(preferenceType) {
      let component = this;
      component.$(`.${preferenceType} .body`).slideDown();
      let propertyValue = capitalizeString(preferenceType);
      component.set(`is${propertyValue}Expanded`, true);
    },

    /**
     * Action triggered when user click on the up arrow icon
     */
    onHidePanel: function(preferenceType) {
      let component = this;
      component.$(`.${preferenceType} .body`).slideUp();
      let propertyValue = capitalizeString(preferenceType);
      component.set(`is${propertyValue}Expanded`, false);
    }
  },

  // --------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number}
   */

  citizenship: 0,

  /**
   * @property {Number}
   */
  authority: 0,

  /**
   * @property {Number}
   */
  reputation: 0,

  /**
   * List of user grades
   * @property {Array}
   */
  userGrades: [],

  /**
   * Current user profile
   * @property {Array}
   */
  userProfile: [],

  /**
   * List of user preference curators
   * @property {Array}
   */
  userPrefsCurators: [],

  /**
   * List of user providers
   * @property {Array}
   */
  userPrefsProviders: [],

  /**
   * List of user content types
   * @property {Array}
   */
  userPrefsContent: [],

  /**
   * show/hide content type panel
   * @property {Boolean}
   */
  isContentExpanded: true,

  /**
   * show/hide provider panel
   * @property {Boolean}
   */
  isProviderExpanded: true,

  /**
   * show/hide curators panel
   * @property {Boolean}
   */
  isCuratorExpanded: true
});
