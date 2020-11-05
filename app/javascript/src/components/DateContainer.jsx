import React from 'react'
import { isYesterday, isToday } from 'date-fns'
import PropTypes from 'prop-types'
import dateutil from '../utils/dateutil'

const timeZone = 'Africa/Lusaka'

// returns a stringified date
export function dateTimeToString(date) {
  return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', timeZone })
}
export function dateToString(date) {
  const lDate = date.toLocaleString("en-GB", { timeZone })
  // eslint-disable-next-line import/no-named-as-default-member
  return dateutil.dateToString(new Date(lDate))
}

/**
 *
 * @param {Number} days
 * @returns Date
 * @description returns a date in the future based on the days given, yyyy-mm-dd hh:mm
 */
export function futureDateAndTimeToString(days) {
  const date = new Date()
  const dueIn10 = new Date(date.setDate(date.getDate() + days))
  const currDate = new Date(dueIn10).getDate()
  const currMonth = new Date(dueIn10).getMonth() + 1
  const currYear = new Date(dueIn10).getFullYear()
  return `${currYear}-${currMonth}-${currDate} ${dateTimeToString(new Date(date))}`
}

/**
 * 
 * @param {Date} objDate 
 * @description works similary to DateContainer but returns a string instead
 * @returns {String}
 */
export function dateFormatter(objDate){
  // eslint-disable-next-line no-nested-ternary
  return isToday(new Date(objDate))
  ? `Today at ${dateTimeToString(new Date(objDate))}`
  : isYesterday(new Date(objDate))
  ? `Yesterday at ${dateTimeToString(new Date(objDate))}`
  : dateToString(objDate)
}

export default function DateContainer({ date }) {
  return (
    <span>
      {dateFormatter(date)}
    </span>
  )
}

DateContainer.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
}
