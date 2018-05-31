import ConfigurationService from 'admin-dataview/services/configuration';

/**
 * Get endpoint url from config
 */
export function getEndpointUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration ? configuration.get('endpoint.url') : '';
}

/**
 * Get endpoint secure url from config
 */
export function getEndpointSecureUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration ? configuration.get('endpoint.secureUrl') : '';
}
