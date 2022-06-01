import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import NotificationBell from '../component/NotificationBell'


describe('The Notification bell component', () => {
  const data = {
    myTasksCount: 1
  }

  const messageCount = {
    msgNotificationCount: 1
  }
  const history = {
    push: jest.fn()
  }
  const user = {
      userTyepe: 'admin',
      id: 'jehfie'
  }

  it('render without error', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <NotificationBell
            user={user}
            data={data}
            history={history}
            messageCount={messageCount}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => expect(screen.queryByTestId('notification_icon')).toBeInTheDocument())
  })
})