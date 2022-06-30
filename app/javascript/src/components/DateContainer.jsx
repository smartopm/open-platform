import React from 'react';
import { isYesterday, isToday } from 'date-fns';
import PropTypes from 'prop-types';
import moment from 'moment-timezone'
import { useTranslation } from 'react-i18next';

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
 * @param {t} translation
 * @description works similary to DateContainer but returns a string instead
 * @returns {String}
 */
export function dateFormatter(objDate, t) {
  if (!objDate) return null;
  // eslint-disable-next-line no-nested-ternary
  return isToday(new Date(objDate))
    ? `${t('common:misc.today_at')} ${dateTimeToString(objDate)}`
    : isYesterday(new Date(objDate))
    ? `${t('common:misc.yesterday_at')} ${dateTimeToString(objDate)}`
    : dateToString(objDate);
}

export default function DateContainer({ date }) {
  const { t } = useTranslation('common');
  return <span style={{ fontSize: '12px' }}>{dateFormatter(date, t)}</span>;
}

DateContainer.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
};
