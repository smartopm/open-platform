import React from 'react'
import { mount } from 'enzyme'
import DateContainer, { dateTimeToString, dateToString, futureDateAndTimeToString } from '../components/DateContainer'
import DateUtils, { lastDayOfTheMonth, getMonthName } from '../utils/dateutil'

describe('date container component', () => {
  it('renders a span element and has correct time', () => {
    // get today's date
    const date = new Date()
    const time = dateTimeToString(date)
    const component = mount(<DateContainer date={date} />)
    expect(component.find('span')).toHaveLength(1)
    expect(component.find('span').text()).toContain(`Today at ${time}`)
  })
  it('renders a span just yesterday time if date was from yesterday', () => {
    // get yesterday's date
    const date = new Date()
    const previousDate = date.setDate(date.getDate() - 1)
    const component = mount(<DateContainer date={previousDate} />)
    expect(component.find('span').text()).toContain('Yesterday')
  })

 it('renders date for older dates', () => {
   // get old date
   const date = new Date()
   const oldDate = date.setDate(date.getDate() - 2)
   const component = mount(<DateContainer date={oldDate} />)
   expect(component.find('span').text()).toContain(
     dateToString(oldDate)
   )
 })
  
 it('should get the proper future date', () => {
   const date = new Date()
   const futureDate = date.setDate(date.getDate() + 2)
   expect(futureDateAndTimeToString(2)).toContain(dateToString(futureDate))
 })

  it('should return the correct last day of the month', () => {
    expect(lastDayOfTheMonth.toString()).toContain('26') // 26 as last day of the month
  })

  it('should return the correct week day', () => {
      const date = "2020-06-11T15:26:05.596Z"
      expect(DateUtils.getWeekDay(new Date(date))).toContain('Thursday') // 26 as last day of the month
  })

  it('should return the correct time difference', () => {
    const date = new Date()
    const date2 = new Date().setDate(new Date().getDate() - 2)
    expect(DateUtils.differenceInHours(new Date(date2), date)).toContain('48 hrs')
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
    expect(DateUtils.formatDate()).toContain('Never')
  })
})
