import React from 'react'
import { isYesterday, isToday } from 'date-fns'
import { PropTypes } from 'prop-types'

import { utcToZonedTime, format } from 'date-fns-tz'
import dateutil from '../utils/dateutil'

const timeZone = 'Africa/Lusaka'

const zonedDate = date => utcToZonedTime(date, timeZone)
const timePattern = 'HH:mm'

const dateTimeToString = date =>
  format(zonedDate(date), timePattern, {
    timeZone
  })

export default function DateContainer({ date }) {
  return (
    <span>
      {isToday(new Date(date))
        ? `Today at ${dateTimeToString(new Date(date))}`
        : isYesterday(new Date(date))
        ? 'Yesterday'
        : dateutil.dateToString(new Date(date))}
    </span>
  )
}

DateContainer.propType = {
  date: PropTypes.instanceOf(Date).isRequired
}
