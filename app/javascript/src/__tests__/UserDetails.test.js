import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import UserDetail from '../components/User/UserDetail'

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
          subStatus: 'construction_approved'
        }
      },
      userType: 'admin'
    }
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UserDetail {...props} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('User Name')).toBeInTheDocument()
    expect(container.queryByText('Entry Logs >')).toBeInTheDocument()
    expect(container.queryByText('Already Expired')).toBeInTheDocument()
    expect(container.queryByTestId('user-sub-status').textContent).toContain('Sub Status: Construction Approved')
  })
})
