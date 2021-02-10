import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SubStatusTimeDistributionReport from '../components/User/SubStatusTimeDistributionReport'
import { userSubStatus } from '../utils/constants';

describe('<SubStatusTimeDistributionReport />', () => {
  it('render correctly', () => {
    const props = {
      ...userSubStatus
    }
    const container = render(<SubStatusTimeDistributionReport userSubStatus={props} />)
    
    expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument()
    expect(container.queryAllByText(/0 - 10 days/i).length).toBeGreaterThan(1)
  })
})
