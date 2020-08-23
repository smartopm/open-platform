import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TaskStatCard from '../components/Notes/TaskStatCard'

describe('Task card to display metrics', () => {
  const props = {
    count: 3,
    title: 'Tasks with date',
    filterTasks: jest.fn()
  }

  it('It should render the component with no errors', () => {
    const {getByText, getByTestId} = render(<TaskStatCard {...props} />)
    expect(getByText('Tasks with date')).toBeInTheDocument()
    expect(getByTestId('task_count').textContent).toContain("3")
  })
})
