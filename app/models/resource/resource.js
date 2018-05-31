import Ember from 'ember';
import { TAXONOMY_CATEGORIES } from 'admin-dataview/config/config';
/**
 * Resource model
 *
 * @typedef {Object} Resource
 */
const ResourceModel = Ember.Object.extend({
  /**
   * @property {Number} id
   */
  id: 0,

  /**
   * @property {Number} assessmentId - if has a linked assessment in the study player
   */
  assessmentId: 0,

  /**
   * @property {String} url
   */
  url: null,

  /**
   * @property {String} assetUrl
   * TODO: Remove this once API 3.0 integration is completed
   */
  assetUrl: Ember.computed.alias('url'),

  /**
   * @property {String} thumbnailUrl
   */
  thumbnailUrl: null,

  /**
   * @property {Boolean} isEditing
   */
  isEditing: false,

  /**
   * @property {string}
   */
  format: null,

  /**
   * @property {string}
   */
  title: null,

  /**
   * @property {string}
   */
  description: null,

  /**
   * @property {string}
   */
  narration: null,

  /**
   * @property {string} published|unpublished|requested
   */
  publishStatus: null,

  /**
   * @property { Content/User }
   */
  owner: null,

  /**
   * The original creator
   * @property { Content/User }
   */
  creator: null,

  /**
   * When the owner and the creator are the same
   * @property {boolean}
   */
  sameOwnerAndCreator: Ember.computed.equal('owner.id', 'creator.id'),

  /**
   * @property {Boolean} isPublic
   */
  isPublished: Ember.computed.equal('publishStatus', 'published'),

  /**
   * @property {Boolean} isVisibleOnProfile - Indicates if the Question is visible on Profile. By default it is false
   */
  isVisibleOnProfile: false,

  /**
   * @property {TaxonomyTagData[]} an array with Taxonomy data
   */
  standards: [],

  /**
   * @property {Number[]} Array with the centurySkills ids
   */
  centurySkills: [],

  /**
   * Some metadata properties
   * @property {{}}
   */
  info: null,

  /**
   * @property {string}
   */
  publisher: null,

  /**
   * @property {boolean}
   */
  amIThePublisher: false,

  /**
   * Sequence number, when is part of a collection
   * @property {number}
   */
  order: null,

  /**
   * @property {{}}
   */
  displayGuide: null,

  /**
   * @property {String} category - Category the course belongs to
   */
  category: Ember.computed('subject', function() {
    var category = TAXONOMY_CATEGORIES[0].value; // Default to K12 category
    if (this.get('subject')) {
      let keys = this.get('subject').split('.');
      if (keys.length > 1) {
        for (var i = TAXONOMY_CATEGORIES.length - 1; i >= 0; i--) {
          // The second part of the subjectId represents the category
          if (keys[1] === TAXONOMY_CATEGORIES[i].apiCode) {
            category = TAXONOMY_CATEGORIES[i].value;
            break;
          }
        }
      }
    }
    return category;
  }),

  /**
   * @property {String} Taxonomy primary subject ID
   */
  subject: '',

  /**
   * @property {String} Indicates the resource type. i.e video/youtube, assessment-question, image/png
   */
  resourceType: Ember.computed('format', function() {
    let format = this.get('format');
    let resourceUrl = this.get('url');
    let youtubePattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    let vimeoPattern = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/;
    let pdfPattern = /.*\.pdf/;
    let resourceType = 'resource/url'; // Default type
    if (resourceUrl) {
      switch (format) {
      case 'audio':
      case 'interactive':
      case 'webpage':
        resourceType = 'resource/url'; // Default type
        break;
      case 'image':
        resourceType = pdfPattern.test(resourceUrl) ? 'handouts' : 'image';
        break;
      case 'text':
        resourceType = 'handouts';
        break;
      case 'video':
        if (youtubePattern.test(resourceUrl)) {
          resourceType = 'video/youtube';
        } else if (vimeoPattern.test(resourceUrl)) {
          resourceType = 'vimeo/video';
        } else {
          resourceType = 'resource/url';
        }
        break;
      default:
        resourceType = 'resource/url'; // Default type
      }
    }
    return resourceType;
  }),

  /**
   * Indicates if it is an image resource
   * @property {boolean}
   */
  isImageResource: Ember.computed('resourceType', function() {
    var resourceType = this.get('resourceType');
    return resourceType && resourceType.indexOf('image') >= 0;
  }),

  /**
   * Indicates if it is an youtube resource
   * @property {boolean}
   */
  isYoutubeResource: Ember.computed.equal('resourceType', 'video/youtube'),

  /**
   * Indicates if it is an pdf resource
   * @property {boolean}
   */
  isPDFResource: Ember.computed.equal('resourceType', 'handouts'),

  /**
   * Indicates if it is an url resource
   * @property {boolean}
   */
  isUrlResource: Ember.computed.equal('resourceType', 'resource/url'),

  /**
   * Indicates if it is an vimeo resource
   * @property {boolean}
   */
  isVimeoResource: Ember.computed.equal('resourceType', 'vimeo/video'),

  /**
   * Indicates if the resources is a 3rd party/remote url
   * Uploaded resources are not considered remote
   * @property {boolean}
   */
  isRemote: true

});

export default ResourceModel;
