import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskUpdateList from '../Components/TaskUpdateList'


describe('Comment Card Component', () => {
  const data = [
    {
      id: 'jkfer',
      action: 'create',
      noteEntityType: 'Comments::NoteComment',
      user: { name: 'John' },
      createdAt: new Date()
    }
  ]


  it('render updates without error', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdateList
            data={data}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('John')).toBeInTheDocument()
    expect(container.queryByText(/task.history_create_new_note_comment/)).toBeInTheDocument()
    expect(container.queryByText(/misc.today_at/)).toBeInTheDocument()
    expect(container.queryByTestId('history_update_divider')).toBeInTheDocument()

  })

  it('should render \'updates not available\' when no task updates', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdateList
            data={[]}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('task.history_update_no_data')).toBeTruthy();
  });
})
