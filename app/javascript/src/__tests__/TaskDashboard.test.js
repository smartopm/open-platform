import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { TaskStatsQuery } from '../graphql/queries'
import TaskDashboard from '../components/Notes/TaskDashboard'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Test the Todo page', () => {
    const mocks = [
      {
        request: {
          query: TaskStatsQuery,
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
              myOpenTasks: 2
            }
          }
        }
      }
    ]

    const filterTasks = jest.fn()
    
  it('Mount the Todo component', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
          <TaskDashboard filterTasks={filterTasks} />
      </MockedProvider>
    )
    expect(container.queryByText('No Actions yet')).toBeTruthy()
    expect(container.queryByTestId('todo-container')).toBeTruthy()
  })
})
