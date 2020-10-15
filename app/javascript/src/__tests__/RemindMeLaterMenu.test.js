import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import RemindMeLaterMenu from '../components/Notes/RemindMeLaterMenu'

describe('remind me later menu menu component', () => {
  it('show correct action menu', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <RemindMeLaterMenu
            anchorEl={null}
            handleClose={jest.fn()}
            taskId="637861hjgdhj"
            setTaskReminder={jest.fn()}
            open
          />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('In 1 hour')).toBeInTheDocument()
    expect(container.queryByText('In 24 hours')).toBeInTheDocument()
    expect(container.queryByText('In 72 hours')).toBeInTheDocument()
  })
})
