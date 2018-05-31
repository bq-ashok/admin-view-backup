import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * Indicates the default group size of   component.
   * @type {Number}
   */
  defaultGroupSize: 4,

  /**
   * content data count list
   * @type {Array}
   */
  contentCountData: null,

  /**
   * Grouped the content data count object by default size.
   * @return {Array}
   */
  groupContentData: Ember.computed('contentCountData', function() {
    let data = this.get('contentCountData');
    let groupData = null;
    if (data) {
      groupData = Ember.A();
      while (data.length > 0) {
        groupData.push(data.splice(0, this.get('defaultGroupSize')));
      }
    }
    return groupData;
  }),

  // -------------------------------------------------------------------------
  // Events

  init() {
    const component = this;
    component._super(...arguments);
  },

  didRender() {
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  }
});
