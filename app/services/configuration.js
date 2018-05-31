import Ember from 'ember';
import ConfigurationAdapter from 'admin-dataview/adapters/configuration';
import Env from 'admin-dataview/config/environment';
import DevelopmentConfiguration from 'admin-dataview/config/env/development';
import TestConfiguration from 'admin-dataview/config/env/test';
import ProductionConfiguration from 'admin-dataview/config/env/production';

const ConfigurationService = Ember.Service.extend({

  configurationAdapter: null,

  /**
   * Application configuration
   */
  configuration: null,

  init: function () {
    this._super(...arguments);
    this.set('configurationAdapter', ConfigurationAdapter.create(Ember.getOwner(this).ownerInjection()));
  },


  loadConfiguration: function() {
    const service = this;
    const environment = Env.environment;
    const isProduction = environment === 'production';
    const isDevelopment = environment === 'development';
    const envConfiguration = isProduction ? ProductionConfiguration :
      (isDevelopment ? DevelopmentConfiguration : TestConfiguration);

    const configuration = Ember.Object.create(envConfiguration);

    //setting the configuration to the global variable
    ConfigurationService.configuration = configuration;

    this.set('configuration', configuration);

    const hostname = window.location.hostname;

    return service.get('configurationAdapter').loadConfiguration(hostname)
      .then(function(hostnameConfiguration){ //it looks for the specific domain configuration
        if (hostnameConfiguration) {
          service.merge(hostnameConfiguration);
        }
        return configuration;
      });
  },

  /**
   * Merges properties
   */
  merge: function(props) {
    this.get('configuration').setProperties(props);
  }
});

ConfigurationService.reopenClass({

  /**
   * Application configuration properties
   */
  configuration: null
});

export default ConfigurationService;
