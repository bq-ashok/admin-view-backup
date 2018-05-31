import Ember from 'ember';
const TRUNCATE_TYPES = {
  'name': 15,
  'short': 10,
  'medium': 35,
  'medium-large':100,
  'large': 200
};
const DEFAULT_TRUNCATE_TYPE = 'short';

/**
 * Truncates a text
 * @param {string} text
 * @param {number} maxLength max allowed length for text, optional
 * @param {string} type indicates the truncate type, optional
 * @param {boolean} suffix indicates if it adds or not a suffix, default is true
 * @returns {*}
 */
function truncateString(text, maxLength, type, suffix){
  if (!text) { return null; }

  if (!maxLength && !type){ //default behavior
    type = DEFAULT_TRUNCATE_TYPE;
  }

  if (type) {
    maxLength = TRUNCATE_TYPES[type] || TRUNCATE_TYPES[DEFAULT_TRUNCATE_TYPE];
  }

  let addSuffix = (suffix !== false);

  let truncated = text;
  if (text.length > maxLength) {
    truncated = text.substring(0, maxLength);
    if (addSuffix) {
      truncated = `${truncated  }...`;
    }
  }
  return truncated;
}

/**
 * Convenience helper to truncate texts
 *
 * {{truncate text='my text' maxLength=10 type='name' suffix=true}}
 *
 * maxLength, used if type is not provided
 * type, optional parameters, indicates the type of truncation, it looks into configuration
 * suffix, default value is true, used to add ... as text suffix
 *
 * @param {[]} params
 * @param {{}} hash, it has helper parameters
 * @returns {*}
 */
export function truncate(params, hash) {
  let text = hash.text;
  let maxLength = hash.maxLength;
  let type = hash.type;
  let suffix = hash.suffix;

  return truncateString(text, maxLength, type, suffix);
}

export default Ember.Helper.helper(truncate);
