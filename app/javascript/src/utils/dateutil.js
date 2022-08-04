/* eslint-disable */
import { isWeekend, isSaturday, isSunday } from 'date-fns'
import { useTranslation } from 'react-i18next';
import momentTimezone from "moment-timezone";

const date = new Date()
export const lastDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 26)

function fromISO8601(isostr) {
  var parts = isostr.match(/\d+/g)
  return new Date(
    parts[0],
    parts[1] - 1,
    parts[2],
    parts[3],
    parts[4],
    parts[5]
  )
}

function isExpired(date) {
  const now = new Date()
  if (!date) return
  return now > new Date(date)
}

/**
 *
 * @deprecated prefer using the helpers in DateContainer
 */
export function dateToString(date) {
  if (!(date instanceof Date)) {
    date = fromISO8601(date)
  }
  return (
    date.getFullYear() +
    '-' +
    pad('00', date.getMonth() + 1) +
    '-' +
    pad('00', date.getDate())
  )
}

/**
 * @deprecated prefer using the helpers in DateContainer
 */
function formatDate(datetime) {
  const { t } = useTranslation('common');
  if (datetime) {
    const date = fromISO8601(datetime)
    return (
      date.getFullYear() +
      '-' +
      pad('00', date.getMonth() + 1) +
      '-' +
      pad('00', date.getDate())
    )
  }
  return t('misc.never');
}

/**
 *
 * @param {object} {object}
 * @description returns either true or false is the time is valid based on permitted visiting hours, this depends on which day of the week it is.
 * @returns {Boolean}
 */
 export function isTimeValid({ date, visitingHours }) {
  const currentHour = date.getHours()
  if (!isWeekend(date)) return (currentHour > visitingHours.weekday.min && currentHour < visitingHours.weekday.max)
  if (isSaturday(date)) return (currentHour > visitingHours.saturday.min && currentHour < visitingHours.saturday.max)
  if (isSunday(date)) return (visitingHours.sunday.isNotOff)
  return true
}

/**
 *
 * @param {Date} date
 * @description returns the day in a week in word format based on a given day
 * @returns {String} day in a week
 */
export function getWeekDay(date) {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const day = new Date(date).getDay();
  return weekdays[day];
}

/**
 *
 * @param {Date} date
 * @description returns a boolean if the passed date less than today's date
 * @returns {Boolean} bool
 */
export function checkPastDate(selDate){
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
  const time = `${today.getHours()}:${today.getMinutes()}`
  const dateTime = `${date}${' '}${time}`
  if (Date.parse(selDate) < Date.parse(dateTime)){
    return true
  }
  return false
}

/**
 *
 * @param {Date} date
 * @description returns the month in a year in word format based on a given day
 * @returns {String} month in a year
 */
export function getMonthName(date) {
  let monthDate
  if (!(date instanceof Date)) {
    monthDate = new Date(date)
  }
  monthDate = date
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  const monthIndex = monthDate.getMonth();
  return months[monthIndex];
}

/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @description calculates difference between 2 dates, if hours less than 1 then it ruturns number of minutes
 * @returns {String} hours || minutes
 */
export function differenceInHours(startDate, endDate) {
  if (!startDate) return
  // in case ended_at is null, initialize it.
  const lastDate = endDate || new Date()
  const diff_seconds = (new Date(lastDate).getTime() - new Date(startDate).getTime()) / 1000;
  const diff_hours = diff_seconds / (60 * 60)
  const diff_minutes = diff_seconds / 60
  const hours = Math.abs(diff_hours.toFixed(2))
  const minutes = Math.abs(diff_minutes.toFixed(2))
  if (hours >= 1) {
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`
  }
  return `${minutes} minutes`
}

export default {
  fromISO8601,
  dateToString,
  isExpired,
  formatDate,
  getWeekDay,
  differenceInHours,
}

// pad("00", "1") => "01"
function pad(padStr, str) {
  str = str.toString(10)
  return padStr.substring(0, padStr.length - str.length) + str
}

/**
 *
 * @param {Date} date
 * @param {String} timezone
 * @description formats date with the passed timezone
 * @returns {String} Date || HR || Min
 */
export function formatTimeZone(date, timezone) {
  if (!date) return null
  if (date && timezone) {
    return momentTimezone(date).tz(timezone).format('YYYY-MM-DD HH:mm')
  }
  return date
}
