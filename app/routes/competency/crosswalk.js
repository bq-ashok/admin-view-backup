import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

  //Methods
  //-------------------------------------------------------------------------

  setupController: function(controller) {
    controller.set('enableGenerateTableBtn', false);
    controller.set('showCrosswalkTable', false);
    controller.set('showSubjectBrowser', true);
    controller.set('selectedFrameworks', []);
  }

});
