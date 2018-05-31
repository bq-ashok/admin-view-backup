import {
  GRADING_SCALE
} from 'admin-dataview/config/config';
import {
  isNumeric
} from './math';

/**
 * Find the route path last occurrence
 * @return {String}
 */
export function getRoutePathLastOccurrence() {
  let currentLocationPath = window.location.pathname;
  return currentLocationPath.substr(currentLocationPath.lastIndexOf('/') + 1);
}

/**
 * Find the route path first occurrence
 * @return {String}
 */
export function getRoutePathFirstOccurrence() {
  let currentLocationPath = window.location.pathname;
  return currentLocationPath.split('/')[2];
}

/**
 * Get the resource format to be App compliant
 * @function
 * @param format
 * @returns {string}
 */
export function getResourceFormat(format) {
  return format ? format.split('_')[0] : undefined; // i.e video_resource to video
}

/**
 * Truncate given string into 72 chars
 * @function
 * @param text
 * @returns {string}
 */
export function truncateString(text, length = 95) {
  if (text && text.length > 100) {
    return `${text.substring(0, length)  }...`;
  }
  return text;
}

/**
 * Format a certain number of milliseconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInMillis - time value in milliseconds
 * @returns {String}
 */
export function formatTime(timeInMillis) {
  var result = '';
  var secs;

  if (timeInMillis && timeInMillis > 0) {
    secs = timeInMillis / 1000;
    const hours = secs / 3600;
    secs = secs % 3600;
    const mins = secs / 60;
    secs = secs % 60;

    if (hours >= 1) {
      result = `${Math.floor(hours)}h `;
      if (mins >= 1) {
        result += `${Math.floor(mins)}m`;
      }
    } else {
      if (mins >= 1) {
        result = `${Math.floor(mins)}m `;
      }
      if (secs >= 1) {
        result += `${Math.floor(secs)}s`;
      }
    }
  } else {
    result = '0s';
  }

  return result;
}

/**
 * Around value of count format
 * @param  {Number} count
 * @return {String} formated string of count
 */
export function dataCountFormat(count) {
  return Math.abs(Number(count)) >= 1.0e+9 ?
    `${Math.round(Math.abs(Number(count)) / 1.0e+9)  }B` :
    Math.round(Math.abs(Number(count)) >= 1.0e+6) ?
      `${Math.round(Math.abs(Number(count)) / 1.0e+6)  }M` :
      Math.round(Math.abs(Number(count)) >= 1.0e+3) ?
        `${Math.round(Math.abs(Number(count)) / 1.0e+3)  }K` :
        Math.round(count);
}

/**
 * Around value of count format by Kilo(thousand)
 * @param  {Number} count
 * @return {String} formated string of count
 */
export function dataCountFormatByKilo(count) {
  const usLocale = 'en-US';
  const countSuffix = Math.round(Math.abs(Number(count)) >= 1.0e+3) ? 'K' : '';
  return count.toLocaleString(usLocale) + countSuffix;
}


/**
 * Transform the given text into capitalize form
 * @function
 * @param text
 * @returns {string}
 */
export function capitalizeString(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Find the color corresponding to the grade bracket that a specific grade belongs to
 * @see admin-dataview/config/config#BARS_GRADING_SCALE
 * @param grade
 * @returns {String} - Hex color value
 */
export function getBarGradeColor(grade) {
  var bracket = GRADING_SCALE.length - 1;
  var color = '#b8bfc4'; // Default color

  if (isNumeric(grade)) {
    for (; bracket >= 0; bracket--) {
      if (grade >= GRADING_SCALE[bracket].LOWER_LIMIT) {
        color = GRADING_SCALE[bracket].COLOR;
        break;
      }
    }
  }
  return color;
}


/**
 * Find the range corresponding to the grade bracket that a specific grade belongs to
 * @see gooru-web/config/config#BARS_GRADING_SCALE
 * @param grade
 * @returns {String} - range value
 */
export function getGradeRange(score) {
  var scaleSize = GRADING_SCALE.length - 1;
  var range = 'not-started'; // Default color

  if (isNumeric(score)) {
    for (; scaleSize >= 0; scaleSize--) {
      if (score >= GRADING_SCALE[scaleSize].LOWER_LIMIT) {
        range = GRADING_SCALE[scaleSize].RANGE;
        break;
      }
    }
  }
  return range;
}


/**
 * Formats a date into a string
 * @param {Date} date
 * @param {string} format
 */
export function formatDate(date, format) {
  format = format || 'dddd, MMMM Do, YYYY h:mm A';
  return moment(date).format(format);
}

/**
 * TODO customized search text for limited subjects on search
 * @param {String} subjectName
 */
export function getSearchFilterTextBySubjectName(subjectName) {
  let subjectfilter = subjectName;
  switch (subjectName) {
  case 'Math':
    subjectfilter = 'Math~~Mathematics';
    break;
  case 'English Language Arts':
    subjectfilter = 'English Language Arts & Literacy~~English Language Arts~~English Language Arts/Literacy~~English Language Arts and Reading~~ELA';
    break;
  case 'Social Sciences':
    subjectfilter = 'Social Studies~~History~~History-Social Science~~Social Sciences';
    break;
  }
  return subjectfilter;
}
