import React from 'react'
import DateFilterComponent from '../components/DateFilterComponent'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

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
    const input = container.getByLabelText("to:")
    fireEvent.change(input, { target: { value: '2020-08-16' } })

    expect(input.value).toBe('2020-08-16')
    expect(container.queryByText('Logged in to')).toBeInTheDocument()
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
    const input = container.getByLabelText("on:")
    fireEvent.change(input, { target: { value: '2020-08-16' } })

    expect(input.value).toBe('2020-08-16')
    expect(container.queryByText('Logged in on')).toBeInTheDocument()
  })

  it('should render with correct props', () => {
    const props = {
      handleFilterInputChange: jest.fn(),
      classes: {},
      filterType: "log_from",
      handleDateChangeFrom: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
    const input = container.getByLabelText("from:")
    fireEvent.change(input, { target: { value: '2020-08-16' } })

    expect(input.value).toBe('2020-08-16')
    expect(container.queryByText('Filter for Campaign')).toBeInTheDocument()
    expect(container.queryByText('Logged in from')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).not.toBeDisabled()
  })
})
