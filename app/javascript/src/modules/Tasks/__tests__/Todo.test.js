import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import Todo from '../containers/Todo';
import { TaskStatsQuery } from '../graphql/task_queries';
import { flaggedNotes } from '../../../graphql/queries';
import taskMock from '../__mocks__/taskMock';


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

  it('renders the todo list page correctly',  async () => {
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
      },
        {
          request: {
            query: flaggedNotes,
            variables: {
              offset: 0,
              limit: 50,
              query: 'assignees: Another somebodyy AND completed: false '
            }
          },
          result: {
           flaggedNotes: [
            taskMock
           ]
          }
        }
    ];

      const container = render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <Todo />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );

      expect(container.queryByTestId('filter')).toBeInTheDocument();
      expect(container.queryByTestId('filter_container')).toBeInTheDocument();
      expect(container.queryByTestId('create_task_btn')).toBeInTheDocument();
      expect(container.queryByTestId('search')).toBeInTheDocument();
  });
});
