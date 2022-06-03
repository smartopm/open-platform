import React from 'react'
import { render } from '@testing-library/react'

import TaskStatCard from '../Components/TaskStatCard'

describe('Task card to display metrics', () => {
  const props = {
    count: 3,
    title: 'Tasks with date',
    filter: jest.fn(),
    isCurrent: true
  }

  it('should render the component with no errors', () => {
    const {getByText, getByTestId} = render(<TaskStatCard {...props} />)
    expect(getByText('Tasks with date')).toBeInTheDocument()
    expect(getByTestId('task_count').textContent).toContain("3")
  })
})
