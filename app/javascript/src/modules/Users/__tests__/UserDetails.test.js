import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import UserDetail from '../Components/UserProfileDetail'
import MockedThemeProvider from '../../__mocks__/mock_theme'

describe('user detail component', () => {
  it('show correct user details', () => {
    const props = {
      data: {
        user: {
          phoneNumber: '34342',
          name: 'User Name',
          email: 'user@dgdp.com',
          id: '34543543rfsf3',
          expiresAt: new Date('03-03-2020'),
          userType: 'admin',
          subStatus: 'building_permit_approved'
        }
      },
      userType: 'admin'
    }
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserDetail {...props} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('User Name')).toBeInTheDocument()
    expect(container.queryByText('34342')).toBeInTheDocument()
  })
})
