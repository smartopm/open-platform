import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import UserActionMenu from '../components/User/UserActionMenu'

describe('user action menu component', () => {
  it('show correct action menu', () => {
    const props = {
      data: {
        user: {
          phoneNumber: '34342',
          name: 'User Name',
          email: 'user@dgdp.com',
          id: '34543543rfsf3',
          expiresAt: new Date('03-03-2020')
        }
      },
      userType: 'admin'
    }
    const container = render(
        <BrowserRouter>
          <UserActionMenu
            data={props.data} 
            router={jest.fn()} 
            anchorEl={null} 
            handleClose={jest.fn()} 
            userType={props.userType} 
            CSMNumber={"353453"}
            open={true}
            OpenMergeDialog={jest.fn()}
            />
        </BrowserRouter>
    )
    expect(container.queryByText('Edit')).toBeInTheDocument()
    expect(container.queryByText('Merge User')).toBeInTheDocument()
    expect(container.queryByText('Send SMS to User Name')).toBeInTheDocument()
    expect(container.queryByText('Call User Name')).toBeInTheDocument()
    expect(container.queryByText('Call User Name')).toBeInTheDocument()
    expect(container.queryByText('User Logs')).toBeInTheDocument()
    expect(container.queryByText('Message Support')).toBeInTheDocument()
    expect(container.queryByText('Message Support')).toBeInTheDocument()
    expect(container.queryByText('Print')).toBeInTheDocument()
    expect(container.queryByText('Send One Time Passcode')).toBeInTheDocument()
  })
})
