import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import TaskUpdateForm from '../components/Notes/TaskUpdateForm'

const data = {
  id: '6v2y3etyu2g3eu2',
  user: {
    id: '543rfsdf34',
    name: 'tolulope',
    imageUrl: 'http://image.com'
  },
  assignees: [
    { name: 'tolulope O.', id: '34543' },
    { name: 'another_user', id: '983y7r2' }
  ],
  assigneeNotes: [],
  completed: false
}
const props = {
  data,
  assignUser: jest.fn(),
  refetch: jest.fn(),
  users: [],
  currentUser: { name: 'tester', id: '6523gvhvg' }
}
describe('task form component', () => {
  it('should render and have editable fields', () => {
    const container = render(
      <MockedProvider>
        <TaskUpdateForm {...props} />
      </MockedProvider>
    )
    expect(container.queryByText('Update Task')).toBeInTheDocument()

    const description = container.queryByLabelText('task_description')
    const submitBtn = container.queryByLabelText('task_submit')
    const previewBtn = container.queryByLabelText('preview')
    const editBtn = container.queryByLabelText('edit')

    fireEvent.change(description, {
      target: { value: 'This is a description of the task' }
    })
    expect(description.value).toBe('This is a description of the task')

    expect(container.queryByText('Mark as complete')).toBeInTheDocument()
    expect(container.queryByText('Mark as complete')).not.toBeDisabled()
    expect(container.queryByText('tolulope')).toBeInTheDocument()
    expect(container.queryByText('tolulope O.')).toBeInTheDocument()
    expect(container.queryByText('another_user')).toBeInTheDocument()
    expect(container.queryAllByTestId('user_chip').length).toBe(3)
    expect(container.queryByText('Task Body')).toBeInTheDocument() // for the toggler
    expect(submitBtn.textContent).toContain('Update Task')
    expect(previewBtn).not.toBeNull()
    expect(editBtn).not.toBeNull()
    expect(submitBtn).not.toBeDisabled()
  })

  it('should render the remind-me-later button if current user is an assignee', () => {
    const newProps = {
      ...props,
      currentUser: { name: 'tolulope 0.', id: '34543' }
    }
    const container = render(
      <MockedProvider>
        <TaskUpdateForm {...newProps} />
      </MockedProvider>
    )

    const reminderBtn = container.queryByText(/Remind me later/i)
    expect(reminderBtn).toBeInTheDocument()

    fireEvent.click(reminderBtn)

    expect(container.queryByText('In 1 hour')).toBeInTheDocument()
    expect(container.queryByText('In 24 hours')).toBeInTheDocument()
    expect(container.queryByText('In 72 hours')).toBeInTheDocument()
  })
})
