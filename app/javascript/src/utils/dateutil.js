import {dateTimeToString as newTime} from '../components/DateContainer'
import { isWeekend, isSaturday } from 'date-fns'
import { zonedDate } from '../components/DateContainer'

// TODO: @olivier => write tests for these

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

function dateToString(date) {
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

function dateTimeToString(date) {
  return newTime(date)
}

function formatDate(datetime) {
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
  return 'Never'
}

/**
 * 
 * @param {Date} date 
 * @description returns either true or false is the time is valid for Nkwashi entrace, this depends on which day of the week it is. 
 * @returns {Boolean}
 */
export function isTimeValid(date) {
  const currentHour = date.getHours()
  if (!isWeekend(date)) return (currentHour > 8 && currentHour < 16)
  if (isSaturday(date)) return (currentHour > 8 && currentHour < 12)
  return true
}

/**
 * 
 * @param {Date} date 
 * @description returns the day in a week in word format based on a given day
 * @returns {String} day in a week
 */
export function getWeekDay(date) {
  let new_date 
  if (!(date instanceof Date)) {
    new_date = new Date(date)
  }
  new_date = date
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const day = new_date.getDay();
  return weekdays[day];
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
  const diff_seconds = (zonedDate(lastDate).getTime() - zonedDate(startDate).getTime()) / 1000;
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
  dateTimeToString,
  dateToString,
  isExpired,
  formatDate,
  getWeekDay,
  differenceInHours
}

// pad("00", "1") => "01"
function pad(padStr, str) {
  str = str.toString(10)
  return padStr.substring(0, padStr.length - str.length) + str
}
