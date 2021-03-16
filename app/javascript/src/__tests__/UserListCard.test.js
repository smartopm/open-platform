import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import UserListCard from '../components/UserListCard'

describe('It displays the user list and interactions', () => {
  const props = {
    userData: {
      users: [
        {
          avatarUrl: null,
          email: 'domain@email.com',
          id: '59927651-9bb4-4e47-8afe-0989d03d210d',
          imageUrl: null,
          name: 'Test Referral 2',
          notes: [],
          phoneNumber: '0987654123',
          roleName: 'Admin',
          subStatus: 'building_permit_approved',
          labels: [
            {
              id: 'de2392ec-398f-40e2-a983-7caee40b2073',
              shortDesc: 'Res'
            }
          ]
        }
      ]
    },
    sendOneTimePasscode: jest.fn(),
    handleUserSelect: jest.fn(),
    currentUserType: 'Admin',
    selectedUsers: ['uuid123-4'],
    offset: 0,
    selectCheckBox: false
  }
  it('it mounts component without error', () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UserListCard {...props} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText(/Test Referral 2/).textContent).toContain(
      'Test Referral 2'
    )
    expect(container.queryByText(/Admin/).textContent).toContain('Admin')
    expect(container.queryByText(/0987654123/).textContent).toContain(
      '0987654123'
    )
    expect(container.queryByText(/domain@email.com/).textContent).toContain(
      'domain@email.com'
    )
    expect(container.queryByTestId('user-substatus').textContent).toContain(
      'Building Permit Approved'
    )
  })
})
