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
  if (!date) return false
  return now > date
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
  if (!(date instanceof Date)) {
    date = fromISO8601(date)
  }
  return date.getHours() + ':' + pad('00', date.getMinutes())
}

function formatDate(datetime) {
  if (datetime) {
    const date = fromISO8601(datetime)
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    )
  }
  return 'Never'
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
