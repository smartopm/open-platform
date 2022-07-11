import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { render, fireEvent, screen } from '@testing-library/react'

import { BrowserRouter, Route } from 'react-router-dom/'
import { createClient } from '../../../utils/apollo'
import Task from '../Components/Task'
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar'

// find elements that are available when DOM mounts then check the visual contents
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
    assignees: [{ name: 'Tester', id: '93sd45435' }],
    assigneeNotes: []
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
  handleModal: jest.fn(),
  currentUser: { name: 'Tester', id: '93sd45435' }
}

describe('Task Component', () => {
  it('should not render with wrong props', () => {
    const container = render(
      <BrowserRouter>
        <ApolloProvider client={createClient}>
          <MockedSnackbarProvider>
            <Task {...props} />
            <Route path={`/tasks/${props.note.id}`}>{props.note.body}</Route>
          </MockedSnackbarProvider>
        </ApolloProvider>
      </BrowserRouter>
    )

    expect(container.queryByText('Note example')).toBeInTheDocument()
    expect(container.queryByText('Johnsc')).toBeInTheDocument()
    expect(container.queryByText('somebody')).toBeInTheDocument()
    expect(container.queryByText(/never/i)).toBeInTheDocument()
    const completeBtn = container.queryByText(/Mark as complete/i)
    expect(completeBtn).toBeInTheDocument()
    expect(completeBtn).not.toBeDisabled()

    fireEvent.click(completeBtn)
    expect(mck).toHaveBeenCalled()
    const assigneeBtn = container.queryByText(/Add Assignee/i)
    expect(assigneeBtn).toBeInTheDocument()
    fireEvent.click(assigneeBtn)
    expect(container.queryByText(/Add Assignee/i)).not.toBeInTheDocument()
    expect(container.queryByText(/created this note/i)).toBeInTheDocument()
    expect(container.queryByText(/Tester/i)).toBeInTheDocument()

    const reminderBtn = container.queryByText(/Remind me later/i)
    expect(reminderBtn).toBeInTheDocument()
    fireEvent.click(reminderBtn)
    expect(mck).toHaveBeenCalled()

    const moreDetailsBtn = container.getByTestId('more_details_btn')
    expect(moreDetailsBtn).toBeInTheDocument()
    fireEvent.click(moreDetailsBtn)
    expect(screen.getAllByText(`${props.note.body}`)).not.toBeNull()

    const editDueDateBtn = container.getByTestId('edit_due_date_btn')
    expect(editDueDateBtn).toBeInTheDocument()
    fireEvent.click(editDueDateBtn)
    expect(props.handleModal).toHaveBeenCalled()
  })

  it('should not render reminder button if current user is not an assignee', () => {
    const newProps = {...props, currentUser: {name: 'Tester2', id: '103sd45435' }}
    const container = render(
      <BrowserRouter>
        <ApolloProvider client={createClient}>
          <MockedSnackbarProvider>
            <Task {...newProps} />
          </MockedSnackbarProvider>
        </ApolloProvider>
      </BrowserRouter>
    )

    const reminderBtn = container.queryByText(/Remind me later/i)
    expect(reminderBtn).toBeNull()
  })
})
