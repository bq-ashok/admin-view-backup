import Ember from 'ember';
import AuthenticatedRouteMixin from 'admin-dataview/mixins/authenticated-route-mixin';
import { TAXONOMY_CATEGORIES } from 'admin-dataview/config/config';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  //------------------------------------------------------------------------
  //Dependencies

  i18n: Ember.inject.service(),

  /**
   * @requires service:taxonomy
   */
  taxonomyService: Ember.inject.service('taxonomy'),

  //-------------------------------------------------------------------------
  //Properties

  defaultFrameworkId: 'GDT',

  /**
   * categories list of taxonomy
   * @return {Object}
   */
  categories: Ember.computed(function() {
    let controller = this;
    let categories = Ember.A();
    TAXONOMY_CATEGORIES.forEach(category => {
      let data = Ember.Object.create({
        title: controller.get('i18n').t(category.label).string,
        type: 'category',
        id: category.apiCode,
        code: category.value,
        subjects: Ember.A()
      });
      categories.pushObject(data);
    });
    return categories;
  }),

  dataLoadCount: 0,

  // -------------------------------------------------------------------------
  // Methods

  model: function() {
    return this.loadTaxonomyData();
  },

  loadTaxonomyData: function() {
    let route = this;
    return Ember.RSVP.hash({
      categories: route.get('categories'),
      subjects: this.get('taxonomyService').getSubjects()
    }).then(({ categories }) => {
      let promises = Ember.A();
      categories.forEach(category => {
        let categoryId = category.get('code');
        this.get('taxonomyService')
          .getSubjects(categoryId)
          .then(subjects => {
            subjects.forEach(subject => {
              if (!subject.get('frameworkId')) {
                subject.set('frameworkId', route.get('defaultFrameworkId'));
              }
            });
            category.set('subjects', subjects);
          });
      });
      return Ember.RSVP.all(promises).then(function() {
        return Ember.RSVP.hash({
          categories: categories
        });
      });
    });
  },

  setupController: function(controller, model) {
    let data = Ember.Object.create({
      name: 'Gooru',
      type: 'root',
      id: 'GDT',
      children: Ember.A()
    });
    controller.set('taxonomyTreeViewData', data);
    controller.set('categories', model.categories);
    let dataLoadCount = controller.get('dataLoadCount') + 1;
    controller.set('dataLoadCount', dataLoadCount);
  }
});
