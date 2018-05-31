import config from 'admin-dataview/config/environment';

export const RESOURCE_COMPONENT_MAP = {
  'video/youtube': 'player.resources.gru-youtube-resource',
  'resource/url': 'player.resources.gru-url-resource',
  handouts: 'player.resources.gru-pdf-resource',
  image: 'player.resources.gru-image-resource',
  'vimeo/video': 'player.resources.gru-vimeo-resource'
};

export const UPLOADABLE_TYPES = [
  {
    value: 'image',
    validExtensions: '.jpg, .jpeg, .gif, .png',
    validType: 'image/*'
  },
  {
    value: 'text',
    validExtensions: '.pdf',
    validType: 'application/pdf'
  }
];

export const VIDEO_RESOURCE_TYPE = 'video';

export const RESOURCE_TYPES = [
  'webpage',
  VIDEO_RESOURCE_TYPE,
  'interactive',
  'audio',
  'image',
  'text'
];

export const VIDEO_RESOURCE = {
  value: RESOURCE_TYPES.VIDEO_RESOURCE_TYPE,
  apiCode: 'video_resource',
  label: 'common.resource-type.video'
};

export const WEBPAGE_RESOURCE = {
  value: RESOURCE_TYPES.webpage,
  apiCode: 'webpage_resource',
  label: 'common.resource-type.webpage'
};

export const INTERACTIVE_RESOURCE = {
  value: RESOURCE_TYPES.interactive,
  apiCode: 'interactive_resource',
  label: 'common.resource-type.interactive'
};

export const AUDIO_RESOURCE = {
  value: RESOURCE_TYPES.audo,
  apiCode: 'audio_resource',
  label: 'common.resource-type.audio'
};

export const IMAGE_RESOURCE = {
  value: RESOURCE_TYPES.image,
  apiCode: 'image_resource',
  label: 'common.resource-type.image'
};

export const TEXT_RESOURCE = {
  value: RESOURCE_TYPES.text,
  apiCode: 'text_resource',
  label: 'common.resource-type.text'
};

export const RESOURCE_TYPE_CONFIG = [
  VIDEO_RESOURCE,
  WEBPAGE_RESOURCE,
  INTERACTIVE_RESOURCE,
  AUDIO_RESOURCE,
  IMAGE_RESOURCE,
  TEXT_RESOURCE
];


export const DEFAULT_IMAGES = {
  USER_PROFILE: `${config.rootURL}assets/images/profile.png`,
  COURSE: `${config.rootURL}assets/images/course-default.png`,
  RUBRIC: `${config.rootURL}assets/images/rubric-default.png`,
  COLLECTION: `${config.rootURL}assets/images/collection-default.png`,
  ASSESSMENT: `${config.rootURL}assets/images/assessment-default.png`,
  QUESTION_PLACEHOLDER_IMAGE: `${
    config.rootURL
  }assets/images/question-placeholder-image.png`,
  LOADER: `${config.rootURL}/assets/images/loader.svg`
};

export const K12_CATEGORY = {
  value: 'k_12',
  apiCode: 'K12',
  label: 'common.categoryOptions.k12'
};
export const EDUCATION_CATEGORY = {
  value: 'higher_education',
  apiCode: 'HE',
  label: 'common.categoryOptions.higher-ed'
};
export const LEARNING_CATEGORY = {
  value: 'professional_learning',
  apiCode: 'PL',
  label: 'common.categoryOptions.professional-dev'
};

export const SKILLS_TRAINING = {
  value: 'skills_training',
  apiCode: 'SK',
  label: 'common.categoryOptions.skills-training'
};

export const TAXONOMY_CATEGORIES = [
  K12_CATEGORY,
  EDUCATION_CATEGORY,
  LEARNING_CATEGORY,
  SKILLS_TRAINING
];

export const CONTENT_TYPES = {
  COLLECTION: 'collection',
  ASSESSMENT: 'assessment',
  EXTERNAL_ASSESSMENT: 'assessment-external',
  COURSE: 'course',
  UNIT: 'unit',
  LESSON: 'lesson',
  RESOURCE: 'resource',
  QUESTION: 'question',
  RUBRIC: 'rubric'
};

export const ASSESSMENT_SUB_TYPES = {
  PRE_TEST: 'pre-test',
  POST_TEST: 'post-test',
  BACKFILL: 'backfill',
  BENCHMARK: 'benchmark',
  RESOURCE: 'resource'
};

export const KEY_CODES = {
  DOWN: 40,
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32,
  UP: 38
};

export const VIEW_LAYOUT_PICKER_OPTIONS = {
  LIST: 'list',
  THUMBNAILS: 'thumbnails'
};

export const EMOTION_VALUES = [
  {
    value: 5,
    unicode: '1f601'
  },
  {
    value: 4,
    unicode: '1f642'
  },
  {
    value: 3,
    unicode: '1f610'
  },
  {
    value: 2,
    unicode: '1f641'
  },
  {
    value: 1,
    unicode: '1f625'
  }
];

export const SCORES = {
  REGULAR: 60,
  GOOD: 70,
  VERY_GOOD: 80,
  EXCELLENT: 90
};

export const GRADING_SCALE = [
  { LOWER_LIMIT: 0, COLOR: '#F46360', RANGE: '0-59' },
  { LOWER_LIMIT: 60, COLOR: '#ED8E36', RANGE: '60-69' },
  { LOWER_LIMIT: 70, COLOR: '#FABA36', RANGE: '70-79' },
  { LOWER_LIMIT: 80, COLOR: '#A8C99C', RANGE: '80-89' },
  { LOWER_LIMIT: 90, COLOR: '#4B9740', RANGE: '90-100' }
];

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

export const TAXONOMY_LEVELS = {
  COURSE: 'course',
  DOMAIN: 'domain',
  STANDARD: 'standard',
  MICRO: 'micro-standard'
};

export const NAVIGATION_MENUS = [
  'competency',
  'activities',
  'learners',
  'suggest'
];

export const NAVIGATION_MENUS_INDEX = {
  competency: 0,
  activities: 1,
  learners: 2,
  suggest: 3,
  learner: 2
};

export const ACTIVITIES_NAVIGATION_MENUS = [
  'summary',
  'courses',
  'collections',
  'assessments',
  'resources',
  'questions'
];

export const ACTIVITIES_NAVIGATION_MENUS_INDEX = {
  summary: 0,
  courses: 1,
  collections: 2,
  assessments: 3,
  resources: 4,
  questions: 5
};

export const COMPETENCY_NAVIGATION_MENUS = [
  'matrix',
  'crosswalk',
  'tree',
  'learning-map'
];

export const COMPETENCY_NAVIGATION_MENUS_INDEX = {
  matrix: 0,
  crosswalk: 1,
  tree: 2,
  'learning-map': 3
};

export const CODE_TYPES = {
  STANDARD_CATEGORY: 'standard_level_0',
  STANDARD: 'standard_level_1',
  SUB_STANDARD: 'standard_level_2',
  LEARNING_TARGET_L0: 'learning_target_level_0',
  LEARNING_TARGET_L1: 'learning_target_level_1',
  LEARNING_TARGET_L2: 'learning_target_level_2'
};

//Question Types
export const QUESTION_TYPES = {
  multipleChoice: 'MC',
  multipleAnswer: 'MA',
  trueFalse: 'T/F',
  openEnded: 'OE',
  fib: 'FIB',
  hotSpotText: 'HS_TXT',
  hotSpotImage: 'HS_IMG',
  hotTextReorder: 'HT_RO',
  hotTextHighlight: 'HT_HL'
};

export const MULTIPLE_CHOICE_QUESTION = {
  value: QUESTION_TYPES.multipleChoice,
  apiCode: 'multiple_choice_question',
  label: 'common.question-type.MC'
};

export const MULTIPLE_ANSWER_QUESTION = {
  value: QUESTION_TYPES.multipleAnswer,
  apiCode: 'multiple_answer_question',
  label: 'common.question-type.MA'
};

export const TRUE_FALSE_QUESTION = {
  value: QUESTION_TYPES.trueFalse,
  apiCode: 'true_false_question',
  label: 'common.question-type.T/F'
};

export const DRAG_AND_DROP_QUESTION = {
  value: QUESTION_TYPES.hotTextReorder,
  apiCode: 'hot_text_reorder_question',
  label: 'common.question-type.HT_RO'
};

export const HIGHLIGHT_TEXT_QUESTION = {
  value: QUESTION_TYPES.hotTextHighlight,
  apiCode: 'hot_text_highlight_question',
  label: 'common.question-type.HT_HL'
};

export const MULTIPLE_SELECT_IMAGE_QUESTION = {
  value: QUESTION_TYPES.hotSpotImage,
  apiCode: 'hot_spot_image_question',
  label: 'common.question-type.HS_IMG'
};

export const MULTIPLE_SELECT_TEXT_QUESTION = {
  value: QUESTION_TYPES.hotSpotText,
  apiCode: 'hot_spot_text_question',
  label: 'common.question-type.HS_TXT'
};

export const OPEN_ENDED_QUESTION = {
  value: QUESTION_TYPES.openEnded,
  apiCode: 'open_ended_question',
  label: 'common.question-type.OE'
};

export const FIB_QUESTION = {
  value: QUESTION_TYPES.fib,
  apiCode: 'fill_in_the_blank_question',
  label: 'common.question-type.FIB'
};

/**
 * Question type configuration
 */
export const QUESTION_TYPE_CONFIG = [
  MULTIPLE_CHOICE_QUESTION,
  MULTIPLE_ANSWER_QUESTION,
  TRUE_FALSE_QUESTION,
  OPEN_ENDED_QUESTION,
  FIB_QUESTION,
  DRAG_AND_DROP_QUESTION,
  HIGHLIGHT_TEXT_QUESTION,
  MULTIPLE_SELECT_IMAGE_QUESTION,
  MULTIPLE_SELECT_TEXT_QUESTION
];

export const LEARNER_TIME_PERIOD_FILTER = [
  {
    value: 'yesterday',
    label: 'learner.yesterday',
    isActive: false
  },
  {
    value: '1w',
    label: 'learner.last-week',
    isActive: false
  },
  {
    value: '1m',
    label: 'learner.last-month',
    isActive: false
  },
  {
    value: '3m',
    label: 'learner.last-3-months',
    isActive: true
  },
  {
    value: '6m',
    label: 'learner.last-6-months',
    isActive: false
  },
  {
    value: '1y',
    label: 'learner.last-year',
    isActive: false
  },
  {
    value: 'from-the-beginning-of-time',
    label: 'learner.from-the-beginning-of-time',
    isActive: false
  }
];

export const LEARNER_CHILD_ROUTES = [
  'journeys',
  'competencies',
  'courses',
  'activites'
];

export const BARS_GRADING_SCALE = [
  {
    LOWER_LIMIT: 0,
    COLOR: '#D82100'
  },
  {
    LOWER_LIMIT: 60,
    COLOR: '#CF7400'
  },
  {
    LOWER_LIMIT: 70,
    COLOR: '#CC9700'
  },
  {
    LOWER_LIMIT: 80,
    COLOR: '#4B9740'
  },
  {
    LOWER_LIMIT: 90,
    COLOR: '#A8C99C'
  }
];

export const CENTURY_SKILLS_GROUPS = {
  KEY_COGNITIVE_SKILLS_AND_STRATEGIES: 'Key Cognitive Skills and Strategies',
  KEY_CONTENT_KNOWLEDGE: 'Key Content Knowledge',
  KEY_LEARNING_SKILLS_AND_TECHNIQUES: 'Key Learning Skills and Techniques'
};

export const ACTIVITY_FILTER = [
  {
    title: 'activities.filter-types.21-century-skills',
    code: '21-century-skills'
  },
  {
    title: 'activities.filter-types.dok',
    code: 'dok'
  },
  {
    title: 'activities.filter-types.license',
    code: 'licenses'
  },
  {
    title: 'activities.filter-types.publisher',
    code: 'publisher'
  },
  {
    title: 'activities.filter-types.audience',
    code: 'audience'
  }
];

export const DEFAULT_ACTIVITY_FILTERS = [
  {
    title: 'activities.filter-types.category',
    code: 'category'
  },
  {
    title: 'activities.filter-types.subject',
    code: 'subject'
  },
  {
    title: 'activities.filter-types.course',
    code: 'course'
  }
];

export const QUESTION_TYPE_FILTERS = [
  {
    title: 'activities.filter-types.question-type',
    code: 'qt'
  }
];

export const RESOURCE_TYPE_FILTERS = [
  {
    title: 'activities.filter-types.resource-type',
    code: 'rt'
  }
];

export const LEARNING_MAP_DEFAULT_LEVELS = {
  subjectClassification: 'k_12',
  subjectCode: 'K12.MA',
  courseCode: 'K12.MA-MA6'
};

export const LEARNING_MAP_CONTENT_SEQUENCE = [
  'course',
  'unit',
  'lesson',
  'collection',
  'assessment',
  'resource',
  'question',
  'rubric',
  'signatureCollection',
  'signatureAssessment',
  'signatureResource'
];

export const PLAYER_WINDOW_NAME = 'rgo_player';

export const PLAYER_EVENT_SOURCE = {
  RGO: 'rgo'
};
