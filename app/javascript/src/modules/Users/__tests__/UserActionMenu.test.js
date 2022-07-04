import React from 'react'
import { render } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'
import UserActionMenu from '../Components/UserActionMenu'

describe('user action menu component', () => {
  it('show correct action menu', () => {
    const props = {
      data: {
        user: {
          phoneNumber: '34342',
          name: 'User Name',
          email: 'user@dgdp.com',
          id: '34543543rfsf3',
          expiresAt: new Date('03-03-2020'),
          status: 'active'
        }
      },
      userType: 'admin'
    }
    const container = render(
      <BrowserRouter>
        <UserActionMenu
          data={props.data}
          router={jest.fn()}
          anchorEl={document.createElement("button")}
          handleClose={jest.fn()}
          userType={props.userType}
          CSMNumber="353453"
          open
          OpenMergeDialog={jest.fn()}
        />
      </BrowserRouter>
    )
    expect(container.queryByText('menu.user_edit')).toBeInTheDocument()
    expect(container.queryByText('menu.merge_user')).toBeInTheDocument()
    expect(container.queryByText('menu.user_logs')).toBeInTheDocument()
    expect(container.queryByText('menu.message_support')).toBeInTheDocument()
    expect(container.queryByText('menu.print_id')).toBeInTheDocument()
    expect(container.queryByText('menu.send_otp')).toBeInTheDocument()
    expect(container.queryByText('menu.deactivate_user')).toBeInTheDocument()
    expect(container.queryByText('menu.view_plans')).toBeInTheDocument();
  })
})
