import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import UserInfo from '../components/User/UserInfo'

describe('user info component', () => {
  it('render correct data in input fields', () => {
    const props = {
      user: {
        phoneNumber: '34342',
        name: 'User Name',
        email: 'user@dgdp.com',
        id: '34543543rfsf3',
        contactInfos: []
      },
      userType: 'admin'
    }
    const container = render(<UserInfo user={props.user} userType={props.userType} />)
    
    expect(container.queryByLabelText('Name')).toBeInTheDocument()
    expect(container.queryByText('user@dgdp.com')).toBeInTheDocument()
    expect(
      container.queryByText('user_number').closest('input').value
    ).toContain('34342')
    expect(
      container.queryByText('user_email').closest('input').value
    ).toContain('user@dgdp.com')
  })

  it('show temperature log when it is security guard', () => {
    const props = {
        user: {
          phoneNumber: '34342',
          name: 'User Name',
          email: 'user@dgdp.com',
          id: '34543543rfsf3',
          contactInfos: []
        },
      userType: 'security_guard'
    }
    const container = render(
      <MockedProvider mocks={[]}>
        <UserInfo {...props} />
      </MockedProvider>
    )
    expect(container.queryByText('log')).toBeInTheDocument()
  })
})
