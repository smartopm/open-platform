import React from 'react'
import { isYesterday, isToday } from 'date-fns'
import { PropTypes } from 'prop-types'

import { utcToZonedTime, format, toDate } from 'date-fns-tz'
import dateutil from '../utils/dateutil'

const timeZone = 'Africa/Lusaka'

const zonedDate = date => utcToZonedTime(date, timeZone)
const timePattern = 'HH:mm'

export const dateTimeToString = date =>
  format(zonedDate(date), timePattern, {
    timeZone
  })

export default function DateContainer({ date }) {
  const utcDate = toDate(new Date(date), { timeZone: 'UTC' })
  const zonedDate = utcToZonedTime(utcDate, timeZone)

  return (
    <span>
      {isToday(new Date(date))
        ? `Today at ${dateTimeToString(new Date(date))}`
        : isYesterday(new Date(zonedDate))
        ? 'Yesterday'
        : dateutil.dateToString(new Date(zonedDate))}
    </span>
  )
}

DateContainer.propType = {
  date: PropTypes.instanceOf(Date).isRequired
}
