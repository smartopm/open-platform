import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import routeData from 'react-router';
import { SubTasksQuery, TaskQuery } from '../../graphql/task_queries';
import taskMock from '../../__mocks__/taskMock';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import TaskProcessDetail from '../Components/TaskProcessDetail';
import { ProjectQuery } from '../graphql/process_queries';
import MockedThemeProvider from "../../../__mocks__/mock_theme";
import MockedSnackbarProvider from '../../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('TaskProcessDetail Component', () => {
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue({ id: taskMock.id });
  });

  const mocks = [
    {
      request: {
        query: TaskQuery,
        variables: { taskId: taskMock.id }
      },
      result: {
        data: {
          task: taskMock
        }
      }
    },
    {
      request: {
        query: SubTasksQuery,
        variables: { taskId: taskMock.id, limit: taskMock.subTasks.length }
      },
      result: {
        data: {
          taskSubTasks: [{ ...taskMock }]
        }
      }
    },
    {
      request: {
        query: ProjectQuery,
        variables: { formUserId: taskMock.formUserId }
      },
      result: {
        data: {
          project: {
            id: 'f51a0723-59b7-416b-9280-9c2fee73ee66',
            body: 'DoubleGDP'
          }
        }
      }
    }
  ];

  it('renders loader', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskProcessDetail />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument());
  });
});
