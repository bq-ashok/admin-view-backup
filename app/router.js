import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('competency', function() {
    this.route('tree');
    this.route('matrix');
    this.route('crosswalk');
    this.route('learning-map');
  });
  this.route('learners');
  this.route('suggest');
  this.route('sign-in');
  this.route('learner', { path: '/learners/:userId' }, function() {
    this.route('journeys');
    this.route('courses', { path: '/courses/:courseId' });
    this.route('activities');
  });
  this.route('leaners');

  this.route('activity', { path: '/activities/' }, function() {
    this.route('summary');
    this.route('courses');
    this.route('collections');
    this.route('assessments');
    this.route('resources');
    this.route('questions');
  });
  this.route('activities');
});

export default Router;
