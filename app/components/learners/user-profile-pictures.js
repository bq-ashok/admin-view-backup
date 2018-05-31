import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['user-profile-pictures'],

  // -------------------------------------------------------------------------
  // Events

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    // Action triggered when the user click on the arrow
    onClickArrow(direction) {
      let component = this;
      let curPos = component.$('.display-pictures').scrollLeft();
      let nextPos = direction === 'left' ? curPos - 120 : curPos + 120;
      component.$('.display-pictures').animate({
        scrollLeft: nextPos
      }, 600);
    },

    // Action triggered when the user click on the user thumbnail
    onSelectUser(user) {
      let component = this;
      component.sendAction('onSelectUser', user);
    }
  }
});
