import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import UserInfo, { sortByType } from '../components/User/UserInfo'

describe('user info component', () => {
  it('render correct data in input fields', () => {
    const props = {
      user: {
        phoneNumber: '34342',
        name: 'User Name',
        email: 'user@dgdp.com',
        id: '34543543rfsf3',
        contactInfos: [
          {
            id: "834snsudf",
            info: "info@alobase.com",
            contactType: 'email'
          },
          {
            id: '340394sd',
            info: '304903423',
            contactType: 'phone'
          }
        ]
      },
      userType: 'admin'
    }
    const container = render(<UserInfo user={props.user} userType={props.userType} />)
    
    expect(container.queryByLabelText('Name')).toBeInTheDocument()
    expect(container.queryByLabelText('Accounts')).toBeInTheDocument()
    expect(container.queryByLabelText('Primary email')).toBeInTheDocument()
    expect(container.queryByLabelText('Primary phone number')).toBeInTheDocument()
    expect(container.queryByLabelText('Secondary phone number')).toBeInTheDocument()
    expect(container.queryByLabelText('Secondary email address')).toBeInTheDocument()

    expect(sortByType(props.user.contactInfos[0], props.user.contactInfos[1])).toBe(-1)
    expect(sortByType(props.user.contactInfos[1], props.user.contactInfos[0])).toBe(1)
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
