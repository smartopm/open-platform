import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TaskUpdate from '../containers/TaskUpdate';
import { TaskQuery } from "../graphql/task_queries";
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

const props = {
  taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
  handleSplitScreenOpen: () => {},
  handleSplitScreenClose: () => {},
  handleTaskCompletion: () => {},
  handleTaskNotFoundError: () => {}
};

describe('TaskUpdate Component', () => {
  it('redirects to / and do not render task', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdate {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders task details', async () => {
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
              attachments: '',
              formUserId: '',
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
                  avatarUrl: ''
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
                formUserId: '12345'
              }
            }
          }
        }
      }
    ];

    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TaskUpdate {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryAllByTestId('task-info-menu')[0]).toBeInTheDocument();
    }, 10);
  });

  it('renders error page if there is an error', async () => {
    const mocks = [
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
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TaskUpdate {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryByText('Network error: An error occurred')).toBeInTheDocument();
    }, 10);
  });
});
