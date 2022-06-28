import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TaskUpdate from '../containers/TaskUpdate';
import { TaskQuery } from '../graphql/task_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

const props = {
  taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
  handleSplitScreenOpen: () => {},
  handleSplitScreenClose: () => {},
  handleTaskCompletion: () => {},
  handleTaskNotFoundError: () => {}
};

describe('TaskUpdate Component', () => {

  const mocks = [
    {
      request: {
        query: TaskQuery,
        variables: { taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3' }
      },
      result: {
        data: {
          task: {
            id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
            body: '',
            createdAt: '',
            completed: false,
            category: '',
            description: '',
            dueDate: '',
            attachments: [],
            formUserId: '',
            status: 'in_progress',
            order: '1',
            formUser: {
              id: 'some-id',
              formId: '6a7e722a-id',
              user: {
                id: 'user-id',
                name: 'Form User Name'
              }
            },
            user: {
              id: '5678fgd',
              name: 'Joe',
              imageUrl: ''
            },
            assignees: [
              {
                id: '567age',
                name: 'John',
                imageUrl: '',
                avatarUrl: '',
                userType: 'admin'
              }
            ],
            assigneeNotes: [
              {
                id: 'dfghsj8',
                userId: '567dfg',
                reminderTime: ''
              }
            ],
            parentNote: {
              id: 'fghs9',
              body: '',
              formUserId: '12345',
              subTasksCount: 1,
              assignees: [{ id: '34567' }]
            }
          }
        }
      }
    }
  ];


  it('redirects to / and do not render task', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskUpdate {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    }, 10);
  });

  it('renders task details', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskUpdate {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.getByTestId('task-info-section')).toBeInTheDocument();
    }, 10);
  });

  it('renders error page if there is an error', async () => {
    const mock = [
      {
        request: {
          query: TaskQuery,
          variables: { taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3' }
        },
        error: new Error('An error occurred')
      }
    ];

    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskUpdate {...props} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryByText('An error occurred')).toBeInTheDocument();
    }, 10);
  });
});
