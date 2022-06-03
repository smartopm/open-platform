import React from 'react'
import { render } from '@testing-library/react'
import TaskDashboard from '../Components/TaskDashboard'


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Test the Todo page', () => {
  const taskData = {
    loading: true
  }

  const data = {
    data: {
      taskStats: {
        completedTasks: 22,
        tasksDueIn10Days: 7,
        tasksDueIn30Days: 7,
        tasksOpen: 8,
        tasksOpenAndOverdue: 4,
        overdueTasks: 4,
        tasksWithNoDueDate: 6,
        myOpenTasks: 2,
        totalCallsOpen: 2
      }
    }
  }
  const filterTasks = jest.fn()
  it('should show loading', () => {
    const container = render(
      <TaskDashboard
        filterTasks={filterTasks}
        currentTile="tasksOpen"
        taskData={taskData}
      />
    )
    expect(container.queryByText('Loading')).toBeInTheDocument()
  })

  it('Mount the Todo component', async () => {
    const container = render(
      <TaskDashboard
        filterTasks={filterTasks}
        currentTile="tasksOpen"
        taskData={data}
      />
    )
    expect(container.queryByText('task.tasks_completed')).toBeInTheDocument()
    expect(container.queryByText('task.tasks_open')).toBeInTheDocument()
    expect(container.queryByText('task.tasks_with_no_due_date')).toBeInTheDocument()
    expect(container.queryByText('task.overdue_tasks')).toBeInTheDocument()
    expect(container.queryByText('task.tasks_due_in_10_days')).toBeInTheDocument()
    expect(container.queryByText('task.tasks_due_in_30_days')).toBeInTheDocument()
  })
})
