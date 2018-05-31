import Ember from 'ember';
/**
 * Purpose of  this helper is to split the text based on given delimiter
 * and return first occurrence of splitted text
 * @param  {Array} params
 * @return {String}
 */
export function splitText(params) {
  let text = params[0];
  let delimiter = params[1];
  let stringChunks = text.split(delimiter);
  return stringChunks[0];
}

export default Ember.Helper.helper(splitText);
