import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'
import UserJourney from '../components/User/UserJourney'

describe('<UserJourney />', () => {
  it('render correctly', () => {
    const props = {
      user: {
        id: "90849232-234234fsdf-232",
        name: 'User Name',
        substatusLogs: [
          {
            id: "90849232-234234-sdfloeop34-",
            startDate: new Date(),
            stopDate: new Date(),
            previousStatus: 'plots_fully_purchased',
            newStatus: 'eligible_to_start_construction',
          },
        ]
      },
    }
    const refetch = jest.fn()
    const container = render(
      <MockedProvider>
        <UserJourney data={props} refetch={refetch} />
      </MockedProvider>
    )
    
    expect(container.queryByText('Eligible to start Construction')).toBeInTheDocument()
  })
})
