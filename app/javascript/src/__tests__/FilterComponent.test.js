/* eslint-disable */
import React from 'react'
import FilterComponent from '../components/FilterComponent'
import { render } from '@testing-library/react'


const labels = [
  {
    id: 'e6f518b0',
    shortDesc: 'ne'
  }
]
describe('component that centers divs', () => {
  it('should render with correct props', () => {
    const props = {
      handleInputChange: jest.fn(),
      list: labels,
      stateList: ['blue'],
      classes: {},
      resetFilter: jest.fn(),
      type: 'labels'
    }
    const container = render(<FilterComponent {...props} />)
    expect(container.queryByText('Filter by labels')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).toBeInTheDocument()
    expect(container.queryByText('Clear Filter')).not.toBeDisabled()
  })
})
