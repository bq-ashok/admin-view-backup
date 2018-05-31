import Ember from 'ember';


/**
 * __This mixin is used to make routes accessible only for authenticated users
 */
export default Ember.Mixin.create({

  /**
   * The session service.
   * @property session
   * @readOnly
   */
  session: Ember.inject.service('session'),


  beforeModel() {
    const mixin = this;
    if (!mixin.get('session.isAuthenticated')) {
      return mixin.transitionTo('sign-in');
    } else {
      return Ember.RSVP.resolve(mixin._super(...arguments));
    }
  }
});
