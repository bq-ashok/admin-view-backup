import Ember from 'ember';
import Env from '../config/environment';

/**
 * Initialize Routes funtion
 */
export function initialize(instance) {
  let historyCache = Ember.Object.extend({
    /**
     * @property {*} the last route
     */
    lastRoute: Ember.Object.create({
      url: null,
      name: null
    })
  });

  Ember.Route.reopen({
    /**
     * This event handlers sets an specific class to the body everytime a route is activated
     */
    addRouteSpecificClass: function() {
      const route = this;
      const currentRouteName = route.routeName;
      const rootElement = Ember.$(Env.rootElement);
      rootElement.addClass(`route-${  currentRouteName.replace(/\./g, '_')}`);
    }.on('activate'),

    /**
     * This event handlers removes an specific class to the body everytime a route is activated
     */
    removeRouteSpecificClass: function() {
      const route = this;
      const currentRouteName = route.routeName;
      const rootElement = Ember.$(Env.rootElement);
      rootElement.removeClass(`route-${  currentRouteName.replace(/\./g, '_')}`);
    }.on('deactivate'),

    /**
     * When leaving a route this handler save the previous route so it can be accessed from history
     */
    saveLastRoute: function() {
      const route = this;
      const currentRouteName = route.routeName;
      const currentRouteUrl = route.router.get('url');

      const lastRoute = this.get('history.lastRoute');

      const savedRouteUrl = lastRoute.get('url');
      const parentRouteIdx =
        savedRouteUrl && savedRouteUrl.indexOf(currentRouteUrl);

      if (
        !currentRouteName.match(/\.loading/) &&
        (!savedRouteUrl || parentRouteIdx === -1)
      ) {
        // On deactivate, save the "child-most" route
        // For example: on deactive save the route "rgo.gcm", but "rgo" (the parent route)
        // will not be saved
        lastRoute.set('name', currentRouteName);
        lastRoute.set('url', currentRouteUrl);
        this.get('history').set('lastRoute', lastRoute);
      }
    }.on('deactivate'),

    /**
     * Resetting the scroll to the top of the page when browsing to a new page
     */
    restoreScroll: function() {
      window.scrollTo(0, 0);
    }.on('activate')
  });

  // History cache is available to all routes
  instance.application.register('history:main', historyCache);
  instance.application.inject('route', 'history', 'history:main');
}

export default {
  name: 'route',
  initialize: initialize
};
