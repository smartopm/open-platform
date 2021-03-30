import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskReportDialog from '../../components/Notes/TaskReportDialog'
import '@testing-library/jest-dom/extend-expect'
import { TaskStatsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';

describe('Task Report Component', () => {
  const taskStats =
    {
      completedTasks: 1,
      tasksDueIn10Days: 2,
      tasksDueIn30Days: 3,
      tasksOpen: 4,
      tasksOpenAndOverdue: 5,
      overdueTasks: 6,
      tasksWithNoDueDate: 7,
      myOpenTasks: 8,
      totalCallsOpen: 9,
      totalFormsOpen: 1
    }

  const taskReportMock = [
    {
      request: {
        query: TaskStatsQuery
      },
      result: {
        data: {
          taskStats
        }
      }
    }
  ];

  it('render without error', async () => {
    const container = render(
      <MockedProvider mocks={taskReportMock} addTypename={false}>
        <BrowserRouter>
          <TaskReportDialog
            handleClose={jest.fn}
            open
            handleFilter={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    
    const loader = render(<Spinner />);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('Tasks Completed')).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  })
})
