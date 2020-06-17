import React from 'react'
import { isYesterday, isToday } from 'date-fns'
import { PropTypes } from 'prop-types'
import dateutil from '../utils/dateutil'

const timeZone = 'Africa/Lusaka'

// returns a stringified date
export function dateTimeToString(date) {
  return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', timeZone })
}
export function dateToString(date) {
  const lDate = date.toLocaleString("en-GB", { timeZone })
  return dateutil.dateToString(new Date(lDate))
}

export default function DateContainer({ date }) {
  return (
    <span>
      {isToday(new Date(date))
        ? `Today at ${dateTimeToString(new Date(date))}`
        : isYesterday(new Date(date))
          ? `Yesterday at ${dateTimeToString(new Date(date))}`
          : dateToString(date)}
    </span>
  )
}

DateContainer.propType = {
  date: PropTypes.instanceOf(Date).isRequired
}
