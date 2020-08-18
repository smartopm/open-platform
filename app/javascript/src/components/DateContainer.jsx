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

export function dateAndTimeToString(days) {
  const date = new Date()
  const dueIn10 = new Date(date.setDate(date.getDate() + days))
  const curr_date = new Date(dueIn10).getDate()
  const curr_month = new Date(dueIn10).getMonth() + 1
  const curr_year = new Date(dueIn10).getFullYear()
  return `${curr_year}-${curr_month}-${curr_date} ${dateTimeToString(new Date(date))}`
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
