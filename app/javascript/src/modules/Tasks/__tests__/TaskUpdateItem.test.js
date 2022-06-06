import React from 'react'
import { act, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import TaskUpdateItem from '../Components/TaskUpdateItem'


describe('Comment Card Component', () => {
  const mock = {
    user: 'some_user'
  }
  const content = 'added new comment'
  const date = new Date().toISOString()

  it('render without error', async () => {
    let container

    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <TaskUpdateItem
              user={mock.user}
              content={content}
              icon={<AddBoxOutlinedIcon />}
              date={date}
            />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByText(/some_user/i)).toBeInTheDocument()
    expect(container.queryByText(/added new comment/i)).toBeInTheDocument()

    const re = /a-z/g
    const updateItemWithDate = container.getAllByText(''.replace(re, date))
    expect(updateItemWithDate).not.toHaveLength(0)
  })
})
