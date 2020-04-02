import React from 'react'
import { mount } from 'enzyme'
import DateContainer from '../components/DateContainer'
import DateUtils from '../utils/dateutil'

describe('date container component', () => {
  it('renders a span element and has correct time', () => {
    // get today's date
    const date = new Date()
    const time = DateUtils.dateTimeToString(date)
    const component = mount(<DateContainer date={date} />)
    expect(component.find('span')).toHaveLength(1)
    expect(component.find('span').text()).toContain(`Today at ${time}`)
  })
  it('renders a span just yesterday time if date was from yesterday', () => {
    // get today's date
    const date = new Date()
    const previousDate = date.setDate(date.getDate() - 1)
    const component = mount(<DateContainer date={previousDate} />)
    expect(component.find('span').text()).toContain('Yesterday')
  })
})
