/* eslint-disable max-statements */
/* eslint-disable import/prefer-default-export */

/**
 * Add specified number of hours to current time.
 * @param {number} hour
 * @returns {date}
 */
export function addHourToCurrentTime(hour) {
  return new Date(Date.now() + hour * 60 * 60* 1000)
}