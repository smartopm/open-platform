import React from 'react'
import { isYesterday, isToday } from 'date-fns'
import { PropTypes } from 'prop-types'

import { utcToZonedTime, format, toDate } from 'date-fns-tz'
import dateutil from '../utils/dateutil'

const timeZone = 'Africa/Lusaka'

export const zonedTimeDate = date => utcToZonedTime(date, timeZone)
const timePattern = 'HH:mm'

export const dateTimeToString = date =>
  format(zonedTimeDate(date), timePattern, {
    timeZone
  })

export const newCatDate = date =>
  format(zonedTimeDate(date), "yyyy-MM-dd", {
    timeZone
  })

const utcDate = date => toDate(new Date(date), { timeZone: 'UTC' })
export const zonedDate = date => utcToZonedTime(utcDate(date), timeZone)

export default function DateContainer({ date }) {
  return (
    <span>
      {isToday(new Date(date))
        ? `Today at ${dateTimeToString(new Date(date))}`
        : isYesterday(new Date(date))
          ? `Yesterday at ${dateTimeToString(new Date(date))}`
          : dateutil.dateToString(new Date(date))}
    </span>
  )
}

DateContainer.propType = {
  date: PropTypes.instanceOf(Date).isRequired
}
