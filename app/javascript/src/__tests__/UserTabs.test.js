/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import UserStyledTabs from '../components/User/UserTabs'
import '@testing-library/jest-dom/extend-expect'

describe('component that with styled tabs', () => {
  it('should render correct tabs when user is admin', () => {
    const props = {
        tabValue: 'note',
        handleChange: jest.fn(),
        userType: 'admin'
    }
    const container = render(<UserStyledTabs {...props} />)
    expect(container.queryByText('Communication')).toBeInTheDocument()
    expect(container.queryByText('Notes')).toBeInTheDocument()
    expect(container.queryByText('Contact')).toBeInTheDocument()
    expect(container.queryByText('Payments')).toBeInTheDocument()
    expect(container.queryByText('Plots')).toBeInTheDocument()
  })
    
  it('should not show communication and note tabs when user is not admin', () => {
    const props = {
        tabValue: 'note',
        handleChange: jest.fn(),
        userType: 'resident'
    }
    const container = render(<UserStyledTabs {...props} />)
    expect(container.queryByText('Communication')).not.toBeInTheDocument()
    expect(container.queryByText('Notes')).not.toBeInTheDocument()
    expect(container.queryByText('Contact')).toBeInTheDocument()
    expect(container.queryByText('Payments')).toBeInTheDocument()
    expect(container.queryByText('Plots')).not.toBeInTheDocument()
  })
})
