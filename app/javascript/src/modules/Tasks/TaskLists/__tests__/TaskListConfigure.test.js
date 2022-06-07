import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import routeData, { MemoryRouter } from 'react-router';
import ReactTestUtils from 'react-dom/test-utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { CreateTaskList, UpdateTaskList } from '../graphql/task_list_mutation';
import taskMock from '../../__mocks__/taskMock';
import authState from '../../../../__mocks__/authstate';
import TaskListConfigure from '../Components/TaskListConfigure';

describe('Task List Create', () => {
  const TaskListConfigureMock = [
    {
      request: {
        query: CreateTaskList,
        variables: {
          body: 'Sample task list'
        }
      },
      result: {
        data: {
          taskListCreate: {
            note: {
              id: 'a349e612-f65f-4c66-82cb-3e9311ae39b2',
              body: 'Sample task list'
            }
          }
        }
      }
    }
  ];

  it('renders TaskListConfigure component', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={TaskListConfigureMock} addTypename={false}>
        <Context.Provider value={adminUser}>
          <MemoryRouter>
            <MockedThemeProvider>
              <TaskListConfigure />
            </MockedThemeProvider>
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.getByTestId('task-list-name')).toBeInTheDocument();

    const nameField = screen.getByLabelText('task_lists.task_list_name');
    ReactTestUtils.Simulate.change(nameField, { target:{ value: 'Sample task list' } });

    const saveButton = screen.getByRole('button');

    expect(saveButton).toBeEnabled();
    await waitFor(() => fireEvent.click(saveButton));
  });
});

describe('Task List Update', () => {
  const taskListMock = {
    __typename: 'Note',
    id: 'a349e612-f65f-4c66-82cb-3e9311ae39b2',
    body: 'Sample task list',
    noteList: {
      __typename: 'NoteList',
      id: '450e1fa8-b8aa-480b-8e3c-b6f1e8e78a25',
      name: 'Sample task list'
    }
  };

  const TaskListUpdateMock = [
    {
      request: {
        query: UpdateTaskList,
        variables: {
          body: 'Sample task list edited'
        }
      },
      result: {
        data: {
          TaskListConfigure: {
            note: taskMock
          }
        }
      }
    }
  ];

  const mockLocation = {
    pathname: '/tasks/task_lists/edit',
    state: { noteList: taskListMock.noteList, task: taskListMock }
  };

  beforeEach(() => {
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
  });

  it('renders TaskListConfigure component', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={TaskListUpdateMock} addTypename={false}>
        <Context.Provider value={adminUser}>
          <MemoryRouter>
            <MockedThemeProvider>
              <TaskListConfigure />
            </MockedThemeProvider>
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );

    const taskListNameField = screen.getByTestId('task-list-name');
    expect(taskListNameField).toBeInTheDocument();

    ReactTestUtils.Simulate.change(taskListNameField, { target: { value: 'Updated task list name' } });
    expect(taskListNameField.value).toBe('Updated task list name');
  });
});
