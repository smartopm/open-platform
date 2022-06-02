import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TaskReportDialog from '../Components/TaskReportDialog';

import { TaskStatsQuery } from '../graphql/task_queries';
import { Spinner } from '../../../shared/Loading';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Task Report Component', () => {
  const taskStats = {
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
  };

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
          <MockedThemeProvider>
            <TaskReportDialog handleClose={jest.fn} open handleFilter={jest.fn} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('Tasks Completed')).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
});
