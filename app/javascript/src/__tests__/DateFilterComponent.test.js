import React from 'react'
import DateFilterComponent from '../components/DateFilterComponent'
import { render } from '@testing-library/react'
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
      selectDateFrom: "2020-08-16",
      selectDateTo: "",
      selectDateOn: "",
      resetFilter: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
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
      selectDateFrom: "2020-08-16",
      selectDateTo: "",
      selectDateOn: "",
      resetFilter: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
    expect(container.queryByText('Logged in on')).toBeInTheDocument()
  })

  it('should render with correct props', () => {
    const props = {
      handleFilterInputChange: jest.fn(),
      classes: {},
      filterType: "log_from",
      handleDateChangeFrom: jest.fn(),
      handleDateChangeTo: jest.fn(),
      handleDateChangeOn: jest.fn(),
      selectDateFrom: "2020-08-16",
      selectDateTo: "",
      selectDateOn: "",
      resetFilter: jest.fn()
    }
    const container = render(<DateFilterComponent {...props} />)
    expect(container.queryByText('Filter for Campaign')).toBeInTheDocument()
    expect(container.queryByText('Logged in from')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).not.toBeDisabled()
  })
})
