import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import RoutesInfo, { RenderAddSubTasks, RenderTaskListConfigure, RenderTaskLists } from '..';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import t from '../../../__mocks__/t';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { TaskListQuery } from '../graphql/task_lists_queries';
import { CreateTaskList } from '../graphql/task_list_mutation';

describe('Task List', () => {
  const mocks = [
    {
      request: {
        query: TaskListQuery,
        variables: {
          offset: 0,
          limit: 50,
        },
      },
      result: {
        data: {
          taskLists: [],
        },
      },
    },
  ];
  it('renders task list', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <RenderAddSubTasks />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    }, 1);
  });
  it('should render task configure', async () => {
    const TaskListConfigureMock = [
      {
        request: {
          query: CreateTaskList,
          variables: {
            body: 'Sample task list',
          },
        },
        result: {
          data: {
            taskListCreate: {
              note: {
                id: 'a349e612-f65f-4c66-82cb-3e9311ae39b2',
                body: 'Sample task list',
              },
            },
          },
        },
      },
    ];
    const container = render(
      <MockedProvider mocks={TaskListConfigureMock} addTypename>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <RenderTaskListConfigure />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.getByTestId('task-list-name')).toBeInTheDocument();
    }, 1);
  });

  it('should render addsubstasks', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <RenderAddSubTasks />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );
    await waitFor(() => expect(container.getByTestId('loader')).toBeInTheDocument());
  });
  it('exports necessary info', () => {
    expect(RoutesInfo.routeProps.path).toBe('/tasks/task_lists');
    expect(RoutesInfo.name(t)).toBe('menu.task_lists');
    expect(RoutesInfo.moduleName).toBe('task_list');
    expect(RoutesInfo.subRoutes).toHaveLength(2);
  });
});
