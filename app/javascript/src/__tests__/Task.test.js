import React from 'react'
import Task from '../components/Notes/Task'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'

describe('component that centers divs', () => {
  it('should not render with wrong props', () => {
    const props = {
      note: {
        body: 'Note example',
        id: '23',
        createdAt: new Date(),
        author: {
          name: 'Johnsc'
        },
        user: {
          name: 'somebody'
        },
        assignees: []
      },
      message: '',
      users: [],
      handleCompleteNote: jest.fn(),
      loaded: false,
      loading: false,
      classes: {},
      assignUnassignUser: jest.fn(),
      handleDelete: jest.fn(),
      handleModal: jest.fn()
    }
    const container = render(
      <BrowserRouter>
        <Task {...props} />
      </BrowserRouter>
      )
    expect(container.queryByText('Note example')).toBeInTheDocument()
    expect(container.queryByText('Johnsc')).toBeInTheDocument()
    expect(container.queryByText('somebody')).toBeInTheDocument()
  })
})
