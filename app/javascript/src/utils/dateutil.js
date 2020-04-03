import { utcToZonedTime, format } from 'date-fns-tz'

const timeZone = 'Africa/Lusaka'

const zonedDate = date => utcToZonedTime(date, timeZone)
const datePattern = 'yyyy-mm-dd HH:mm'

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
  console.log(date)
  if (!(date instanceof Date)) {
    // date = fromISO8601(date)
    return
  }
  const output = format(zonedDate(date), datePattern, { timeZone })
  return output
}

function dateTimeToString(date) {
  if (!(date instanceof Date)) {
    // date = fromISO8601(date)
    // throw new Error('The provided date is not valid')
    return
  }
  const timePattern = 'HH:mm'
  const output = format(zonedDate(date), timePattern, { timeZone })
  return output
}

function formatDate(datetime) {
  return dateToString(datetime)
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
