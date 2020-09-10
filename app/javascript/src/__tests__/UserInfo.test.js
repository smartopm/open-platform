/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import UserInfo from '../components/User/UserInfo'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'

describe('user info component', () => {
  it('render correct data in input fields', () => {
    const props = {
        data: {
            user: {
                phoneNumber: '34342',
                name: 'User Name',
                email: 'user@dgdp.com',
                id: '34543543rfsf3'
            }
        },
        userType: 'admin'
    }
    const container = render(<UserInfo {...props} />)
      expect(container.queryByLabelText('user_name').closest('input').value).toContain('User')
      expect(container.queryByLabelText('user_account').closest('input').value).toContain('User')
      expect(container.queryByLabelText('user_number').closest('input').value).toContain('34342')
      expect(container.queryByLabelText('user_email').closest('input').value).toContain('user@dgdp.com')
  })
    
  it('show temperature log when it is security guard', () => {
    const props = {
        data: {
            user: {
                phoneNumber: '34342',
                name: 'User Name',
                email: 'user@dgdp.com',
                id: '34543543rfsf3'
            }
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
