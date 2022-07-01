import React from 'react'
import { render } from '@testing-library/react';
import DateContainer, { dateFormatter, dateTimeToString, dateToString, isDateValid, updateDateWithTime } from '../components/DateContainer'
import DateUtils, { lastDayOfTheMonth, getMonthName, getWeekDay, differenceInHours } from '../utils/dateutil'

describe('date container component', () => {
  const t = jest.fn();
  it('renders a span element and has correct time', () => {
    // get today's date
    const date = new Date()
    const time = dateTimeToString(date)
    const component = render(<DateContainer date={date} />)
    expect(component.queryByText(`common:misc.today_at ${time}`)).toBeInTheDocument();
    expect(dateFormatter(date, t)).toContain(time)
  })
  it('renders a span just yesterday time if date was from yesterday', () => {
    // get yesterday's date
    const date = new Date()
    const previousDate = date.setDate(date.getDate() - 1)
    const component = render(<DateContainer date={new Date(previousDate)} />)
    expect(component.queryByText(`common:misc.yesterday_at ${dateTimeToString(previousDate)}`)).toBeInTheDocument();
  })

 it('renders date for older dates', () => {
   // get old date
   const date = new Date()
   const oldDate = date.setDate(date.getDate() - 2)
   const component = render(<DateContainer date={new Date(oldDate)} />)
  expect(component.queryByText(dateToString(oldDate))).toBeInTheDocument();
 })
  it('should return the correct last day of the month', () => {
    expect(lastDayOfTheMonth.toString()).toContain('26') // 26 as last day of the month
  })

  it('should return the correct week day', () => {
      const date = "2020-06-11T15:26:05.596Z"
      expect(getWeekDay(date)).toContain('Thursday') // 26 as last day of the month
  })

  it('should return the correct time difference', () => {
    const date = new Date()
    const date2 = new Date().setDate(new Date().getDate() - 2)
    expect(differenceInHours(new Date(date2), date)).toContain('48 hrs')
  })
  it('should return the correct month name', () => {
    const date = "2020-06-11T15:26:05.596Z"
    expect(getMonthName(new Date(date))).toContain('June')
  })
  it('should return the correctly formatted date', () => {
    const date = "2020-06-11T15:26:05.596Z"
    expect(dateToString(date)).toContain('2020-06-11')
  })
  it('should return formatted date', () => {
    const date = "2020-06-11T15:26:05.596Z"
    expect(DateUtils.formatDate(date)).toContain('2020-06-11')
  })
  it('should return never when date is null', () => {
    expect(DateUtils.formatDate()).toContain('misc.never')
  })
  it('should append time to the date', () => {
    const date1 = new Date('2021-09-07T15:39:00.000Z')
    const date2 = new Date('2021-09-01T20:39:00.000Z')
    const updatedDate = updateDateWithTime(date1, date2)
    expect(new Date(updatedDate)).toEqual(new Date('2021-09-07T20:39:00.000Z'))
    expect(updateDateWithTime('date1', 23421)).toBe('Invalid date')
  })
  it('checks if a given date is valid', () => {
    expect(isDateValid('1d39123212')).toBe(false)
    expect(isDateValid('2021-09-07T15:39:00.000Z')).toBe(true)
  })
})
