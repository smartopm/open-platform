/* eslint-disable */
import React from 'react'
import Task from '../components/Notes/Task'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'

// find elements that are available when DOM mounts then check the visual contents
describe('Task Component', () => {
  it('should not render with wrong props', () => {
    const mck = jest.fn()
    const props = {
      note: {
        body: 'Note example',
        id: '23',
        createdAt: new Date('2020-08-01'),
        author: {
          name: 'Johnsc'
        },
        user: {
          name: 'somebody'
        },
        assignees: [{ name: 'Tester', id: '93sd45435'}]
      },
      message: '',
      users: [],
      handleCompleteNote: mck,
      loaded: true,
      loading: false,
      classes: {},
      completed: false,
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
    expect(container.queryByText(/never/i)).toBeInTheDocument()
    const btn = container.queryByText(/Mark as complete/i)
    expect(btn).toBeInTheDocument()
    expect(btn).not.toBeDisabled()
    
    fireEvent.click(btn)
    expect(mck).toHaveBeenCalled()
    const assigneeBtn = container.queryByText(/Add Assignee/i)
    expect(assigneeBtn).toBeInTheDocument()
    fireEvent.click(assigneeBtn)
    expect(container.queryByText(/Add Assignee/i)).not.toBeInTheDocument()
    expect(container.queryByText(/created this note/i)).toBeInTheDocument()
    expect(container.queryByText(/Tester/i)).toBeInTheDocument()
  })
})
