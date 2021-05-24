import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import Todo from '../containers/Todo';
import { TaskStatsQuery } from '../graphql/task_queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Todo list main page', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null,
      community: {
        supportName: 'Support Officer',
        themeColors: {
          primaryColor: "#nnn",
          secondaryColor: "#nnn"
        }
      }
    }
  };
  it('renders the todo list page correctly', async () => {
    const mocks = [
      {
        request: {
          query: TaskStatsQuery
        },
        result: {
          data: {
            taskStats: {
              completedTasks: 9,
              tasksDueIn10Days: 35,
              tasksDueIn30Days: 35,
              tasksOpen: 42,
              tasksOpenAndOverdue: 35,
              overdueTasks: 35,
              tasksWithNoDueDate: 10,
              myOpenTasks: 25,
              totalCallsOpen: 2,
              totalFormsOpen: 1
            }
          }
        }
      }
    ];

    const pushMock = jest.fn();
    let container;
    await act(async () => {
      container = render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <Todo history={{ push: pushMock }} />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );
    });
    // here what happens is that, because of the authstate, if the user isn't admin then it autoreroutes to home
    expect(pushMock).toBeCalled();
    await waitFor(() => {
      expect(container.queryByText('Home')).toBeInTheDocument();
    }, 50);
  });
});
