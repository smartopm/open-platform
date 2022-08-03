/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import AddSubTasks from '../Components/AddSubTasks';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { TaskListQuery } from '../graphql/task_lists_queries';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({ taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3' })
}));

const taskDataMock = [
  {
    request: {
      query: TaskListQuery,
      variables: { taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3' },
    },
    result: {
      data: {
        taskList: {
          id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
          body: 'Sample task list',
          createdAt: '2022-01-06T11:22:28Z',
          completed: false,
          category: 'to_do',
          description: 'Sample task list sub-task',
          dueDate: '2022-01-22T21:00:00Z',
          subTasksCount: 4,
          taskCommentsCount: 4,
          taskCommentReply: true,
          attachments: [],
          order: 1,
          status: 'in_progress',
          formUserId: '0358e014-1440-46ee-988d-d5338f019ba3',
          __typename: 'Note',
          formUser: {
            id: '0358e014-1440-46ee-988d-d5338f019ba3',
            user: {
              __typename: 'User',
              id: 'c8b16e54-095e-4b92-bf51-b197f6b916a6',
              name: 'Test User',
            },
            __typename: 'User',
          },
          user: {
            id: '5678fgd',
            name: 'Joe',
            imageUrl: '',
            __typename: 'User',
          },
          assignees: [
            {
              id: '567age',
              name: 'John',
              imageUrl: '',
              avatarUrl: '',
              userType: 'admin',
              __typename: 'User',
            },
          ],
          assigneeNotes: [
            {
              id: 'dfghsj8',
              userId: '567dfg',
              reminderTime: '',
              __typename: 'AssigneeNote',
            },
          ],
          subTasks: [
            {
              body: 'Consultant sub-task',
              createdAt: '2022-01-06T11:22:28Z',
              id: '4f5bfb50-0fe1-455a-bff5-ca76b3f3eb2b',
              completed: false,
              category: 'to_do',
              description: 'Consultant sub-task',
              dueDate: '2022-01-22T21:00:00Z',
              subTasksCount: 4,
              order: 1,
              formUserId: '65b665e0-959c-4c08-aaef-3f4b70e85495',
              progress: {
                complete: 1,
                total: 0,
                progress_percentage: null,
              },
              __typename: 'Note',
              user: {
                id: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
                name: 'Daniel Mutuba',
                imageUrl:
                  'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
                __typename: 'User',
              },
              author: {
                id: 'a7b3e608-5ca8-44da-b0f2-8f94239f5a1f',
                name: 'Daniel Mutuba',
                imageUrl:
                  'https://lh3.googleusercontent.com/a-/AOh14Gjnom4vf1f-DPzmjQ4JyU0Jt88Bz0ShVC73LBDCqQ=s96-c',
                avatarUrl: null,
                __typename: 'User',
              },
              subTasks: [],

              assignees: [],
              assigneeNotes: [],
              parentNote: {
                id: '90ba44ef-4306-416b-945f-1d2ea4eb4c46',
                __typename: 'Note',
              },
              documents: [],
              attachments: [],
            },
          ],
          parentNote: {
            id: 'fghs9',
            body: '',
            formUserId: '12345',
            subTasksCount: 1,
            assignees: [{ id: '34567', __typename: 'User' }],
            __typename: 'Note',
          },
        },
      },
    },
  },
];

describe('Test the AddSubTasks page', () => {
  it('renders loader', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={taskDataMock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <AddSubTasks />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument());
  });

  it('mounts the AddSubTasks component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={taskDataMock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <AddSubTasks />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitForElementToBeRemoved(screen.queryByTestId('loader'));

    expect(screen.queryByText('task_lists.task_lists')).toBeInTheDocument();
    expect(screen.queryAllByText('task_lists.configure_task_list')[0]).toBeInTheDocument();

    expect(screen.queryByTestId('task_list_body_section')).toBeInTheDocument();
    // the caret icon should be available since the task has subtasks
    expect(screen.queryByTestId('show_task_list_subtasks')).toBeInTheDocument();
    // assert two menu options
    expect(screen.queryByText('menu.open_details')).toBeInTheDocument();
    expect(screen.queryByText('menu.add_subtask')).toBeInTheDocument();
  });

  it('renders task form modal', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={taskDataMock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <AddSubTasks />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      const taskMenuItem = screen.queryAllByTestId('MoreVertIcon')[0];
      fireEvent.click(taskMenuItem);
      const addSubTaskMenuItem = screen.getByText('menu.add_subtask');
      fireEvent.click(addSubTaskMenuItem);

      expect(screen.queryByLabelText('task_description')).toBeInTheDocument();
      expect(screen.queryByLabelText('task_submit')).toBeInTheDocument();
      expect(screen.queryByLabelText('task_cancel')).toBeInTheDocument();
      expect(screen.queryByLabelText('task_description')).toBeInTheDocument();
      expect(screen.queryByLabelText('task_submit').textContent).toContain('common:form_actions.create_task');
      expect(screen.queryByLabelText('task_cancel').textContent).toContain('common:form_actions.cancel');
      expect(screen.queryByLabelText('task_cancel')).not.toBeDisabled();
      expect(screen.queryByLabelText('task_submit')).not.toBeDisabled();
    });
  });
});
