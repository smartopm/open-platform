import React from 'react'
import { isYesterday, isToday } from 'date-fns'
import { PropTypes } from 'prop-types'
import DateUtil from '../utils/dateutil.js'

export default function DateContainer({ date, isComplex }) {
  if (isComplex) {
    return (
      <span>
        {isToday(new Date(date))
          ? `Today at ${DateUtil.dateTimeToString(new Date(date))}`
          : isYesterday(new Date(date))
          ? 'Yesterday'
          : DateUtil.dateToString(new Date(date))}
      </span>
    )
  }
  return (
    <span>
      {`${DateUtil.dateToString(new Date(date))} 
            ${DateUtil.dateTimeToString(new Date(date))}`}
    </span>
  )
}

DateContainer.propType = {
  date: PropTypes.instanceOf(Date).isRequired,
  isComplex: PropTypes.bool.isRequired
}
