/* eslint-disable */
import React from 'react'
import Users from '../containers/Users'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe("UserPage Component ",() => {
  const adminAuthState = {
    loaded: true,
    loggedIn: true,
    setToken: jest.fn(),
    user: {
      avatarUrl: null,
      community: { name: 'Nkwashi' },
      email: '9753942',
      expiresAt: null,
      id: '11cdad78',
      imageUrl: null,
      name: 'John Doctor',
      phoneNumber: '260971500000',
      userType: 'admin'
    }
  }
  it('should render without error and have all cards for admins',()=> {
     const container =  render(
          <MockedProvider >
            <BrowserRouter>
              <Users authState={adminAuthState} />
          </BrowserRouter>
          </MockedProvider>
     )

    expect(container.getByTestId('loader')).toBeInTheDocument()
  })
})
