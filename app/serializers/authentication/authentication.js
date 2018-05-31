import Ember from 'ember';
import { DEFAULT_IMAGES } from 'admin-dataview/config/config';
import ConfigurationMixin from 'admin-dataview/mixins/configuration';

/**
 * Serializer for the Authentication
 *
 * @typedef {Object} AuthenticationSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {

  /**
   *
   * @param payload is the response coming from the endpoint
   * @param accessToken access token to use when it comes from google sign-in
   * @returns {{accessToken, user: {username: (string|string|string)},
   *            cdnUrls:{content: *, user: *}, isAuthenticated: boolean}}
   */
  normalizeResponse: function(payload, truth,  accessToken) {
    const basePath = payload.cdn_urls.user_cdn_url;
    const appRootPath = this.get('appRootPath'); //configuration appRootPath
    return {
      accessToken: (accessToken ? accessToken : payload.access_token),
      user: {
        username: payload.username,
        id: payload.user_id,
        avatarUrl: payload.thumbnail ?
          basePath + payload.thumbnail : appRootPath + DEFAULT_IMAGES.USER_PROFILE,
        providedAt: payload.provided_at
      },
      cdnUrls: {
        user: basePath,
        content: payload.cdn_urls.content_cdn_url
      },
      isAuthenticated: payload.user_id !== 'anonymous',
      tenant: {
        tenantId: payload.tenant ? payload.tenant.tenant_id : undefined
      },
      partnerId: payload.partner_id
    };
  }
});
