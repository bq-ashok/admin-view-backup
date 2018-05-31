import Ember from 'ember';

export default Ember.Component.extend({
  isChecked: false,

  actions: {
    onToggleButton() {
      let component = this;
      let isChecked = !component.get('isChecked');
      component.set('isChecked', isChecked);
      component.sendAction('onToggleButton', isChecked);
    }
  }
});
