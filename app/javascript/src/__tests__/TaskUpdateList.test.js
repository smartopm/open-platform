import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskUpdateList from '../components/Notes/TaskUpdateList'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Card Component', () => {
  const data = [
    {
      id: 'jkfer',
      action: 'create',
      noteEntityType: 'NoteComment',
      user: { name: 'John' },
      createdAt: new Date()
    }
  ]
  

  it('render updates without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdateList
            data={data}
          />
        </BrowserRouter>
      </MockedProvider>
    )
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

    expect(container.queryByText(/no update/i)).toBeTruthy();
  });
})
