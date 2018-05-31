import Ember from 'ember';
import { TAXONOMY_CATEGORIES, QUESTION_TYPES } from 'admin-dataview/config/config';

//Question type configuration
export const QUESTION_CONFIG = {
  MC: Ember.Object.create({
    apiType: 'multiple_choice_question'
  }),
  MA: Ember.Object.create({
    apiType: 'multiple_answer_question'
  }),
  HT_RO: Ember.Object.create({
    apiType: 'hot_text_reorder_question'
  }),
  HT_HL: Ember.Object.create({
    apiType: 'hot_text_highlight_question'
  }),
  'T/F': Ember.Object.create({
    apiType: 'true_false_question'
  }),
  FIB: Ember.Object.create({
    apiType: 'fill_in_the_blank_question'
  }),
  HS_IMG: Ember.Object.create({
    apiType: 'hot_spot_image_question'
  }),
  HS_TXT: Ember.Object.create({
    apiType: 'hot_spot_text_question'
  }),
  OE: Ember.Object.create({
    apiType: 'open_ended_question'
  })
};
/**
 * Question model
 * typedef {Object} Question
 */
const Question = Ember.Object.extend({
  /**
   * @property {string}
   */
  id: null,

  /**
   * @property {string} title
   */
  title: null,

  /**
   * Possible question types
   * @property {string} type
   */
  type: null,

  /**
   *  @property {string} questionType - Alias for type property
   */
  questionType: Ember.computed.alias('type'),

  /**
   * Resource format, in this case it is question
   * @property {string}
   */
  format: 'question',

  /**
   * @property {string}
   */
  text: null,

  /**
   * @property {string}
   */
  narration: null,

  /**
   * @property {string}
   */
  thumbnail: null,

  /**
   * @property {string}
   */
  description: Ember.computed.alias('text'),

  /**
   * @property {number}
   */
  order: null,

  /**
   * @property {string} published|unpublished|requested
   */
  publishStatus: null,

  /**
   * @property {Boolean} isPublished
   */
  isPublished: Ember.computed.equal('publishStatus', 'published'),

  /**
   * @property { Content/User } Owner of the question
   */
  owner: null,

  /**
   * @property { Content/User } Original creator of the question
   */
  creator: null,

  sameOwnerAndCreator: Ember.computed('owner.id', 'creator', function() {
    if (!this.get('creator')) {
      return true;
    } else if (this.get('owner.id') === this.get('creator')) {
      return true;
    }
  }),
  /**
   * @property {TaxonomyTagData[]} an array with Taxonomy data
   */
  standards: [],

  /**
   * @property {Number[]} Array with the audience ids
   */
  audience: [],

  /**
   * @property {Number[]} Array with the depthOfknowledge ids
   */
  depthOfknowledge: [],

  /**
   * @property {Boolean} isVisibleOnProfile - Indicates if the Question is visible on Profile. By default it is false
   */
  isVisibleOnProfile: false,

  /**
   * @property {Answer[]} answers - Array of answers
   */
  answers: Ember.A([]),

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
   * @property {String} courseId
   */
  courseId: null,

  /**
   * @property {String} unitId
   */
  unitId: null,

  /**
   * @property {String} lessonId
   */
  lessonId: null,

  /**
   * @property {String} collectionId
   */
  collectionId: null,

  /**
   * @property {boolean} indicates if the question is multiple choice type
   * @see components/player/gru-multiple-choice.js
   */
  isMultipleChoice: Ember.computed.equal(
    'questionType',
    QUESTION_TYPES.multipleChoice
  ),

  /**
   * @property {boolean} indicates if the question is multiple answer type
   * @see components/player/gru-multiple-answer.js
   */
  isMultipleAnswer: Ember.computed.equal(
    'questionType',
    QUESTION_TYPES.multipleAnswer
  ),

  /**
   * @property {boolean} indicates if the question is true false type
   * @see components/player/gru-true-false.js
   */
  isTrueFalse: Ember.computed.equal('questionType', QUESTION_TYPES.trueFalse),

  /**
   * @property {boolean} indicates if the question is open ended type
   * @see components/player/gru-open-ended.js
   */
  isOpenEnded: Ember.computed.equal('questionType', QUESTION_TYPES.openEnded),

  /**
   * @property {boolean} indicates if the question is fill in the blank type
   * @see components/player/gru-fib.js
   */
  isFIB: Ember.computed.equal('questionType', QUESTION_TYPES.fib),

  /**
   * @property {boolean} indicates if the question is hot spot text type
   * @see components/player/gru-hot-spot-text.js
   */
  isHotSpotText: Ember.computed.equal(
    'questionType',
    QUESTION_TYPES.hotSpotText
  ),

  /**
   * @property {boolean} indicates if the question is hot spot image type
   * @see components/player/gru-hot-spot-image.js
   */
  isHotSpotImage: Ember.computed.equal(
    'questionType',
    QUESTION_TYPES.hotSpotImage
  ),

  /**
   * @property {boolean} indicates if the question is reorder
   * @see components/player/gru-reorder.js
   */
  isHotTextReorder: Ember.computed.equal(
    'questionType',
    QUESTION_TYPES.hotTextReorder
  ),

  /**
   * @property {boolean} indicates if the question is hot spot text
   * @see components/player/gru-hot-text-highlight.js
   */
  isHotTextHighlight: Ember.computed.equal(
    'questionType',
    QUESTION_TYPES.hotTextHighlight
  ),

  /**
   * @property {boolean} indicates if the question is hot text word type
   */
  isHotTextHighlightWord: Ember.computed.equal(
    'answers.firstObject.highlightType',
    'word'
  ),

  /**
   * @property {boolean} indicates if the question is hot text sentence type
   */
  isHotTextHighlightSentence: Ember.computed.equal(
    'answers.firstObject.highlightType',
    'sentence'
  ),

  /**
   * Indicates if the question supports answer choices
   * @property {boolean}
   */
  supportAnswerChoices: Ember.computed(
    'isMultipleChoice',
    'isMultipleAnswer',
    'isHotTextReorder',
    'isHotSpotText',
    function() {
      return (
        this.get('isMultipleChoice') ||
        this.get('isMultipleAnswer') ||
        this.get('isHotTextReorder') ||
        this.get('isHotSpotText')
      );
    }
  ),

  /**
   * Return a copy of the question
   *
   * @function
   * @return {Question}
   */
  copy: function() {
    var properties = [];
    var enumerableKeys = Object.keys(this);

    for (let i = 0; i < enumerableKeys.length; i++) {
      let key = enumerableKeys[i];
      let value = Ember.typeOf(this.get(key));
      if (value === 'string' || value === 'number' || value === 'boolean') {
        properties.push(key);
      }
    }

    // Copy the question data
    properties = this.getProperties(properties);

    var answersForEditing = this.get('answers').map(function(answer) {
      return answer.copy();
    });
    properties.answers = answersForEditing;
    var standards = this.get('standards');
    var audience = this.get('audience');
    var depthOfknowledge = this.get('depthOfknowledge');
    var rubric = this.get('rubric');

    // Copy standards and metadata values
    properties.standards = standards.slice(0);
    properties.audience = audience.slice(0);
    properties.depthOfknowledge = depthOfknowledge.slice(0);
    if (rubric) {
      properties.rubric = rubric.copy();
    }

    return Question.create(Ember.getOwner(this).ownerInjection(), properties);
  },

  /**
   * Copy a list of property values from another model to override the current ones
   *
   * @function
   * @param {Question} model
   * @param {String[]} propertyList
   * @return {null}
   */
  merge: function(model, propertyList = []) {
    var properties = model.getProperties(propertyList);
    this.setProperties(properties);
  },

  /**
   * Sets the subject of the course
   *
   * @function
   * @param {TaxonomyRoot} taxonomySubject
   */
  setTaxonomySubject: function(taxonomySubject) {
    if (!(this.get('isDestroyed') || this.get('isDestroying'))) {
      this.set('subject', taxonomySubject ? taxonomySubject.get('id') : null);
    }
  }
});


Question.reopenClass({
  /**
   * Returns the question type based on apiType
   * @param {string} apiType, a valid question apiType from API 3.0
   */
  normalizeQuestionType: function(apiType) {
    let type = null;
    for (var property in QUESTION_CONFIG) {
      if (QUESTION_CONFIG.hasOwnProperty(property)) {
        if (QUESTION_CONFIG[property].apiType === apiType) {
          type = property;
          break;
        }
      }
    }
    return type;
  }
});
export default Question;
