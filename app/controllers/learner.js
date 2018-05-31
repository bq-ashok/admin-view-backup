import Ember from 'ember';
import ModalMixin from 'admin-dataview/mixins/modal';

export default Ember.Controller.extend(ModalMixin, {
  // --------------------------------------------------------------------------
  // Query params

  //------------------------------------------------------------------------
  // Events

  actions: {
    onClickBackButton() {
      let pathname = window.location.pathname;
      let pathLists = pathname.split('/');
      if (pathLists.length === 4) {
        this.transitionToRoute('learners');
      } else {
        this.transitionToRoute('learner', this.get('userId'));
      }
    },

    onClickProfileInfo() {
      let controller = this;
      let user = controller.get('user');

      let modalData = {
        user: user
      };
      // Open user profile info modal once user click thumbnail
      controller.send(
        'showModal',
        'modals.learner.user-profile-modal',
        modalData
      );
    },

    onFilterSelection(activeDuration) {
      this.send('onSelectActiveDuration', activeDuration);
    }
  }

  // --------------------------------------------------------------------------
  // Properties
});
