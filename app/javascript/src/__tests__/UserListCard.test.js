import React from 'react'
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
          subStatus: 'architecture_reviewed',
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
    currentUserType: 'Admin'
  }
  it('it mounts component without error', () => {
    const container = render(
      <BrowserRouter>
        <UserListCard {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText(/Test Referral 2/).textContent).toContain(
      'Test Referral 2'
    )
  })

  it('it mounts component with role', () => {
    const container = render(
      <BrowserRouter>
        <UserListCard {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText(/Admin/).textContent).toContain('Admin')
  })

  it('it mounts component with PhoneNumber', () => {
    const container = render(
      <BrowserRouter>
        <UserListCard {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText(/0987654123/).textContent).toContain(
      '0987654123'
    )
  })

  it('it mounts component with email', () => {
    const container = render(
      <BrowserRouter>
        <UserListCard {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText(/domain@email.com/).textContent).toContain(
      'domain@email.com'
    )
  })

  it('it mounts component with sub-status', () => {
    const container = render(
      <BrowserRouter>
        <UserListCard {...props} />
      </BrowserRouter>
    )
    expect(container.queryByTestId('user-substatus').textContent).toContain(
      'Architecture Reviewed'
    )
  })
})
