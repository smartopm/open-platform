import {dateTimeToString as newTime} from '../components/DateContainer'
import { isWeekend, isSaturday } from 'date-fns'

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


export function isTimeValid(date) {
  const currentHour = date.getHours()
  if (!isWeekend(date)) return (currentHour > 8 && currentHour < 16)
  if (isSaturday(date)) return (currentHour > 8 && currentHour < 12)
  return true
}

export function getWeekDay(date) {
  let new_date
  if (!(date instanceof Date)) {
    new_date = new Date(date)
  }
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  let day = new_date.getDay();
  return weekdays[day];
}


export default {
  fromISO8601,
  dateTimeToString,
  dateToString,
  isExpired,
  formatDate
}

// pad("00", "1") => "01"
function pad(padStr, str) {
  str = str.toString(10)
  return padStr.substring(0, padStr.length - str.length) + str
}
