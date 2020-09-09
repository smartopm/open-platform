/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import BusinessActionMenu from '../components/Business/BusinessActionMenu'

describe('business action menu component', () => {
  it('show correct action menu', () => {
    const props = {
      data: {
        id: "6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3"
      },
      authState: { user: { userType: "admin" } }
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <BusinessActionMenu
            data={props.data}
            anchorEl={null}
            handleClose={jest.fn()}
            authState={props.authState}
            refetch={jest.fn()}
            open={true}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('Delete')).toBeInTheDocument()
    expect(container.queryByText('View Details')).toBeInTheDocument()
  })
})
