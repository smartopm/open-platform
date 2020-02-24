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
  return now > date || 'never'
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

export default {
  fromISO8601,
  dateTimeToString,
  dateToString,
  isExpired
}

// pad("00", "1") => "01"
function pad(padStr, str) {
  str = str.toString(10)
  return padStr.substring(0, padStr.length - str.length) + str
}
