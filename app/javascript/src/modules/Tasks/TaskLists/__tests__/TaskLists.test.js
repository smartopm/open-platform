import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';

import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import TaskLists from '../Components/TaskLists';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { TaskListsQuery } from '../graphql/task_lists_queries';
import authState from '../../../../__mocks__/authstate';
import { DeleteTaskList } from '../graphql/task_list_mutation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/tasks/task_lists'
  })
}));

const taskListMock = {
  __typename: 'Note',
  id: 'a349e612-f65f-4c66-82cb-3e9311ae39b2',
  body: 'Sample task list',
  status: 'in_progress',
  subTasksCount: '1',
  completed: false,
  progress: {
    complete: 0,
    progress_percentage: 0,
    total: 0,
  },
  category: 'task_list',
  noteList: {
    __typename: 'NoteList',
    id: '450e1fa8-b8aa-480b-8e3c-b6f1e8e78a25',
    name: 'Sample task list',
    process: {
      __typename: 'Process',
      id: '8239jd2-f8a23-ads23-323d-23i59jkdd',
      name: 'Test Process',
    }
  }
};

describe('Task Lists', () => {
  const mocks = [
    {
      request: {
        query: TaskListsQuery,
        variables: {
          offset: 0,
          limit: 50
        }
      },
      result: {
        data: {
          taskLists: [taskListMock]
        }
      }
    },
    {
      request: {
        query: DeleteTaskList,
        variables: { id: taskListMock.id }
      },
      result: { data: { deleteTaskList: { success: true } } },
    }
  ];

  const emptyResponseMock = [
    {
      request: {
        query: TaskListsQuery,
        variables: {
          offset: 0,
          limit: 50
        }
      },
      result: {
        data: {
          taskLists: []
        }
      }
    }
  ];

  const errorMock = [
    {
      request: {
        query: TaskListsQuery,
        variables: {
          offset: 0,
          limit: 50
        }
      },
      result: {
        data: null,
        errors: [new Error('An error occured')]
      }
    }
  ];

  it('renders loader', () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders no task lists message', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={emptyResponseMock} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('task_lists.task_lists')).toBeInTheDocument();
      expect(screen.queryByText('task_lists.no_task_lists')).toBeInTheDocument();
      expect(screen.getByTestId('create_task_list_btn')).toBeInTheDocument();
      expect(screen.getByTestId('AddIcon')).toBeInTheDocument();
    });
  });

  it('renders correct menu items', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText('task_lists.task_lists')[0]).toBeInTheDocument();
      expect(screen.queryByText('menu.open_details')).toBeInTheDocument();
      expect(screen.queryByText('menu.add_subtask')).toBeInTheDocument();
      expect(screen.queryByText('menu.delete_task_list')).toBeInTheDocument();
      expect(screen.getByTestId('task_body')).toBeInTheDocument();
    });
  });

  it('renders task list menu items', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      const kebabButton = screen.queryAllByTestId('task-item-menu')[0];
      expect(kebabButton).toBeInTheDocument();
      fireEvent.click(kebabButton);
      expect(screen.queryAllByTestId('menu_item')[0]).toBeInTheDocument();
      expect(screen.getByText('menu.open_details')).toBeInTheDocument();
      expect(screen.getByText('menu.add_subtask')).toBeInTheDocument();
      const deleteTaskList = screen.getByText('menu.delete_task_list');
      expect(deleteTaskList).toBeInTheDocument();
      fireEvent.click(deleteTaskList);
      const proceedButton = screen.queryByTestId('proceed_button');
      expect(proceedButton).toBeInTheDocument();
      fireEvent.click(proceedButton);
    });
  });

  it('renders error message', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={errorMock} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('An error occured')).toBeInTheDocument();
    });
  });

  it('renders task details in split view', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('prev-btn')).toBeInTheDocument();
      expect(screen.getByTestId('next-btn')).toBeInTheDocument();

      const kebabButton = screen.queryAllByTestId('task-item-menu')[0];
      expect(kebabButton).toBeInTheDocument();
      fireEvent.click(kebabButton);
      expect(screen.queryAllByTestId('menu_item')[0]).toBeInTheDocument();
      const openDetails = screen.getByText('menu.open_details');
      expect(openDetails).toBeInTheDocument();

      act(() => {
        fireEvent.click(openDetails);
      })

      expect(screen.queryByTestId('drawer')).toBeInTheDocument();
      expect(screen.queryByTestId('drawer-paper')).toBeInTheDocument();
    });
  });

  it('renders new task form', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      const kebabButton = screen.queryAllByTestId('task-item-menu')[0];
      expect(kebabButton).toBeInTheDocument();
      fireEvent.click(kebabButton);
      expect(screen.queryAllByTestId('menu_item')[0]).toBeInTheDocument();
      const addSubTask = screen.getByText('menu.add_subtask');
      expect(addSubTask).toBeInTheDocument();

      act(() => {
        fireEvent.click(addSubTask);
      });
      expect(screen.queryByText('task.task_modal_create_text')).toBeInTheDocument();
      expect(screen.queryByTestId('task-cancel-button')).toBeInTheDocument();
      expect(screen.queryByTestId('task-submit-button')).toBeInTheDocument();
    });
  });

  it('renders error when user attempts to delete a tasklist in use by a process', async () => {
    const adminUser = { userType: 'admin', ...authState };
    render(
      <MockedProvider mocks={mocks} addTypename>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskLists />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      const kebabButton = screen.queryAllByTestId('task-item-menu')[0];
      expect(kebabButton).toBeInTheDocument();
      fireEvent.click(kebabButton);
      expect(screen.queryAllByTestId('menu_item')[0]).toBeInTheDocument();
      const deleteTaskList = screen.getByText('menu.delete_task_list');
      expect(deleteTaskList).toBeInTheDocument();

      act(() => {
        fireEvent.click(deleteTaskList);
      });

      expect(screen.queryByText('Warning')).toBeInTheDocument();
      expect(screen.queryByText('menu.task_list_delete_confirmation_message')).toBeInTheDocument();
      expect(screen.queryByText('form_actions.cancel')).toBeInTheDocument();
      expect(screen.queryByTestId('proceed_button')).toBeInTheDocument();
    });
  });
});
