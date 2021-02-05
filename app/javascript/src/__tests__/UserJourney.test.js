import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import UserJourney from '../containers/User/UserJourney'

describe('<UserJourney />', () => {
  it('render correctly', () => {
    const props = {
      user: {
        name: 'User Name',
        substatusLogs: [
          {
            startDate: new Date(),
            stopDate: new Date(),
            previousStatus: 'plots_fully_purchased',
            newStatus: 'eligible_to_start_construction',
          },
        ]
      },
    }
    const container = render(<UserJourney data={props} />)
    
    expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument()
  })
})
