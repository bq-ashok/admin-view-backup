import Ember from 'ember';

/**
 * @function stringReplace
 * String Replace helper
 */
export function stringReplace(params) {
  let textToReplace = params[0];
  let modifiers = params[3] || '';
  let patternToFind = params[1];
  let regExp = new RegExp(patternToFind, modifiers);
  let patternToMatch = params[2];
  return typeof textToReplace === 'string' ? textToReplace.replace(regExp, patternToMatch) : textToReplace;
}

export default Ember.Helper.helper(stringReplace);
