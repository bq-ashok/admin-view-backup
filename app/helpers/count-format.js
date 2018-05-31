import Ember from 'ember';
import { dataCountFormat as countformat } from 'admin-dataview/utils/utils';

/**
 * Give number to readable value of counted string 1M, 10K etc..
 */
export function countFormat(value /*, hash*/) {
  var count = value[0];
  return countformat(count);
}

export default Ember.Helper.helper(countformat);
