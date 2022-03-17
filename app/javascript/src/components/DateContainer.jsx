import React from 'react';
import { isYesterday, isToday } from 'date-fns';
import PropTypes from 'prop-types';
import moment from 'moment-timezone'


// returns a stringified date
export function dateTimeToString(date) {
  return moment.parseZone(date).format('HH:mm');
}
export function dateToString(date, format = 'YYYY-MM-DD') {
  // eslint-disable-next-line import/no-named-as-default-member
  return moment.parseZone(date).format(format);
}

export function isDateValid(date){
  const temp = new Date(date)
  return moment(temp, 'YYYY-MM-DD hh:mm', true).isValid()
}
/**
 * Updates current date with given time from another date
 * @param {Date} date
 * @param {Date} dateWithTime
 * @returns {string}
 */
 export function updateDateWithTime(date, dateWithTime, timezone){
   if(!isDateValid(date) || !isDateValid(dateWithTime)) return 'Invalid date'

   const currentDate = moment.tz(date, timezone)
   const hour  = moment.tz(dateWithTime, timezone).hours()
   const minute  = moment.tz(dateWithTime, timezone).minutes()

   return currentDate.set({ hour, minute })
}

/**
 *
 * @param {Number} days
 * @returns Date
 * @description returns a date in the future based on the days given, yyyy-mm-dd hh:mm
 */
export function futureDateAndTimeToString(days) {
  const date = new Date();
  const dueIn10 = new Date(date.setDate(date.getDate() + days));
  const currDate = new Date(dueIn10).getDate();
  const currMonth = new Date(dueIn10).getMonth() + 1;
  const currYear = new Date(dueIn10).getFullYear();
  return `${currYear}-${currMonth}-${currDate} ${dateTimeToString(date)}`;
}

/**
 *
 * @param {Date} objDate
 * @description works similary to DateContainer but returns a string instead
 * @returns {String}
 */
export function dateFormatter(objDate) {
  if (!objDate) return null;
  // eslint-disable-next-line no-nested-ternary
  return isToday(new Date(objDate))
    ? `Today at ${dateTimeToString(objDate)}`
    : isYesterday(new Date(objDate))
    ? `Yesterday at ${dateTimeToString(objDate)}`
    : dateToString(objDate);
}

export default function DateContainer({ date }) {
  return <span style={{ fontSize: '12px' }}>{dateFormatter(date)}</span>;
}

DateContainer.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
};
