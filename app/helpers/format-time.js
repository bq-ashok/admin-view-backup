import Ember from 'ember';
import { formatTime as formatMilliseconds } from 'admin-dataview/utils/utils';

/**
 * Give format to a time value
 */
export function formatTime(value /*, hash*/) {
  var time = value[0];
  return formatMilliseconds(time);
}

export default Ember.Helper.helper(formatTime);
