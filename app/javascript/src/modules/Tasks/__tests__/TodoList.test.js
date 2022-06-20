/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TodoList from '../Components/TodoList';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import taskMock from '../__mocks__/taskMock';
import { TasksLiteQuery } from '../graphql/task_queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: '/tasks',
    search: '?taskId=23',
    state: { from: '/', search: '/' }
  }),
  useParams: () => ({ id: '23' })
}));

const mck = jest.fn();
const props = {
  isDialogOpen: false,
  currentUser: authState.user,
  handleModal: mck,
  saveDate: mck,
  selectedDate: new Date(),
  handleDateChange: mck,
  location: 'tasks'
};

const mocks = [
  {
    request: {
      query: TasksLiteQuery,
      variables: {
        offset: 0,
        limit: 50,
        query: 'assignees: John Doctor AND completed: false '
      }
    },
    result: {
      data: {
        flaggedNotes: [taskMock]
      }
    }
  }
];

describe('Test the Todo page', () => {
  it('renders loader', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename>
          <BrowserRouter>
            <MockedThemeProvider>
              <TodoList {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() =>  expect(screen.getByTestId('loader')).toBeInTheDocument())
  });

  it('mounts the TodoList component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename>
          <BrowserRouter>
            <MockedThemeProvider>
              <TodoList {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('create_task_btn')).toBeTruthy()
      expect(screen.queryByTestId('todo-container')).toBeTruthy()
      expect(screen.queryByTestId('search')).toBeTruthy()
      expect(screen.queryByTestId('filter_container')).toBeInTheDocument();
    })
  });

  it('renders todo list section', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename>
          <BrowserRouter>
            <MockedThemeProvider>
              <TodoList {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('todo-list-container')).toBeInTheDocument();
      expect(screen.queryAllByTestId('card')).toHaveLength(1);
    });
  });

  it('renders task form modal', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename>
          <BrowserRouter>
            <MockedThemeProvider>
              <TodoList {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const createTaskBtn = screen.queryByTestId('create_task_btn');
    fireEvent.click(createTaskBtn);

    await waitFor(() => {
      expect(screen.queryByText('task.task_name')).toBeInTheDocument();
      expect(screen.queryAllByText('task.optional_description')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('task.task_type_label')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('task.due_date_optional')[0]).toBeInTheDocument();
    });
  });

  describe('Task details', () => {
    it('does not render split screen on initial page load', async () => {
      render(
        <Context.Provider value={authState}>
          <MockedProvider mocks={mocks} addTypename>
            <BrowserRouter>
              <MockedThemeProvider>
                <TodoList {...props} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
      });
    });

    it('opens split screen view', async () => {
      render(
        <Context.Provider value={authState}>
          <MockedProvider mocks={mocks} addTypename>
            <BrowserRouter>
              <MockedThemeProvider>
                <TodoList {...props} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );

      await waitFor(() => {
        const card = screen.queryAllByTestId('card')[0];
        fireEvent.click(card);
        const menuButton = screen.queryAllByTestId('task-item-menu')[0];
        expect(menuButton).toBeInTheDocument();
        fireEvent.click(menuButton);
        const openTaskDetailsMenu = screen.getByText('menu.open_task_details');
        expect(openTaskDetailsMenu).toBeInTheDocument();
      });
    });
  });
});
