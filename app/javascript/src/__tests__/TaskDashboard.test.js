import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { TaskStatsQuery } from '../graphql/queries'
import TaskDashboard from '../components/Notes/TaskDashboard'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Test the Todo page', () => {
  const mocks = [
    {
      request: {
        query: TaskStatsQuery
      },
      result: {
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
    }
  ]

  const filterTasks = jest.fn()
  it('should show loading', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TaskDashboard filterTasks={filterTasks} />
      </MockedProvider>
    )
    expect(container.queryByText('Loading')).toBeInTheDocument()
  })

  it('Mount the Todo component', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskDashboard filterTasks={filterTasks} />
      </MockedProvider>
    )
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(container.queryByText('Tasks Completed')).toBeInTheDocument()
    expect(container.queryByText('Tasks Open')).toBeInTheDocument()
    expect(container.queryByText('Total Calls Open')).toBeInTheDocument()
    expect(container.queryByText('Tasks with no due date')).toBeInTheDocument()
    expect(container.queryByText('Overdue Tasks')).toBeInTheDocument()
    expect(container.queryByText('Tasks due in 30 days')).toBeInTheDocument()
    expect(container.queryByText('Tasks due in 10 days')).toBeInTheDocument()
  })
})
