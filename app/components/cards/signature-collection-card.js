import Ember from 'ember';
import { DEFAULT_IMAGES, PLAYER_WINDOW_NAME, PLAYER_EVENT_SOURCE } from 'admin-dataview/config/config';

export default Ember.Component.extend({
  classNames: ['cards', 'signature-collection-card'],

  session: Ember.inject.service('session'),

  profileUrl: Ember.computed('collection', function() {
    let component = this;
    let collection = component.get('collection');
    const userBasePath = component.get('session.cdnUrls.user');
    const ownerThumbnailUrl = collection.profileImage
      ? userBasePath + collection.profileImage
      : DEFAULT_IMAGES.USER_PROFILE;
    return ownerThumbnailUrl;
  }),

  actions: {
    /**
     * Action triggered when the user play collection
     * It'll open the player in new tab
     */
    onPlayCollection(collectionId) {
      let locOrigin = window.location.origin;
      let collectionUrl = `/player/${collectionId}?source=${PLAYER_EVENT_SOURCE.RGO}`;
      let playerURL = locOrigin + collectionUrl;
      window.open(playerURL, PLAYER_WINDOW_NAME);
    }
  }
});
