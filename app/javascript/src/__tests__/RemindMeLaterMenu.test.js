import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import RemindMeLaterMenu from '../components/Notes/RemindMeLaterMenu'

describe('remind me later menu menu component', () => {
  it('show correct action menu', () => {
    const remindMock = jest.fn()
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <RemindMeLaterMenu
            anchorEl={null}
            handleClose={jest.fn()}
            taskId="637861hjgdhj"
            setTaskReminder={remindMock}
            open
          />
        </BrowserRouter>
      </MockedProvider>
    )
    const oneHour = container.queryByText('In 1 hour')
    const midHour = container.queryByText('In 24 hours')
    const moreHour = container.queryByText('In 72 hours')
    expect(oneHour).toBeInTheDocument()
    expect(midHour).toBeInTheDocument()
    expect(moreHour).toBeInTheDocument()
    expect(oneHour).not.toBeDisabled()
    expect(midHour).not.toBeDisabled()
    expect(moreHour).not.toBeDisabled()

    fireEvent.click(oneHour)
    expect(remindMock).toBeCalled()
    expect(remindMock).toBeCalledWith(1)

    fireEvent.click(midHour)
    expect(remindMock).toBeCalled()
    expect(remindMock).toBeCalledWith(24)

    fireEvent.click(moreHour)
    expect(remindMock).toBeCalled()
    expect(remindMock).toBeCalledWith(72)
  })
})
