import Ember from 'ember';

/**
 *  Convert string to us locale
 * @param  {String}  value
 * @return {String}
 */
export function usLocale(value) {
  const usLocale = 'en-US';
  return value.toLocaleString(usLocale);
}

export default Ember.Helper.helper(usLocale);
