import Ember from 'ember';
import { formatDate as formatDateTo } from 'admin-dataview/utils/utils';

/**
 * Give format to a date value
 */
export function formatDate(value /*, hash*/) {
  const date = value[0];
  const format = value.length > 1 ? value[1] : undefined;
  const isRemoveMonthPrecedingZero = value[2] || null;
  let formattedDate = formatDateTo(date, format);
  if (isRemoveMonthPrecedingZero) {
    formattedDate = formattedDate.replace(/ 0+/g, ' ');
  }
  return formattedDate;
}

export default Ember.Helper.helper(formatDate);
