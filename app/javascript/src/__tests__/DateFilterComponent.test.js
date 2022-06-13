/* eslint-disable */
import React from 'react'
import DateFilterComponent from '../components/DateFilterComponent'
import { render, fireEvent } from '@testing-library/react'


describe('filter users for campaign component', () => {
  it('should display logged in to option', () => {
    const props = {
      handleFilterInputChange: jest.fn(),
      classes: {},
      filterType: "log_to",
      handleDateChangeFrom: jest.fn(),
      handleDateChangeTo: jest.fn(),
      handleDateChangeOn: jest.fn(),
      selectDateFrom: "",
      selectDateTo: "2020-08-16",
      selectDateOn: "",
      resetFilter: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
    const toInput = container.queryAllByTestId('date-picker')[0].querySelector('input')
    fireEvent.change(toInput, { target: { value: '2020-08-16' } })

    expect(toInput.value).toBe('2020-08-16')
    expect(container.queryByText('login before')).toBeInTheDocument()
  })

  it('should display logged in on option', () => {
    const props = {
      handleFilterInputChange: jest.fn(),
      classes: {},
      filterType: "log_on",
      handleDateChangeFrom: jest.fn(),
      handleDateChangeTo: jest.fn(),
      handleDateChangeOn: jest.fn(),
      selectDateFrom: "",
      selectDateTo: "",
      selectDateOn: "2020-08-16",
      resetFilter: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
    const onInput = container.queryAllByTestId('date-picker')[0].querySelector('input')
    fireEvent.change(onInput, { target: { value: '2020-08-16' } })

    expect(onInput.value).toBe('2020-08-16')
    expect(container.queryByText('logged in on')).toBeInTheDocument()
  })

  it('should render with correct props', () => {
    const props = {
      handleFilterInputChange: jest.fn(),
      classes: {},
      filterType: "log_from",
      handleDateChangeFrom: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
    const fromInput = container.queryAllByTestId('date-picker')[0].querySelector('input')
    fireEvent.change(fromInput, { target: { value: '2020-08-16' } })

    expect(fromInput.value).toBe('2020-08-16')
    expect(container.queryByText('Filter for Campaign')).toBeInTheDocument()
    expect(container.queryByText('login after')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).not.toBeDisabled()
  })
})
