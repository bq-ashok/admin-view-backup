
/**
 * Injects router into all Ember components
 * @param  {Object} registry
 * @param  {Object} application
 */
export function initialize(registry, application) {
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'router-inject',
  initialize: initialize
};
