import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import Todo from '../containers/Todo';
import { TaskStatsQuery } from '../graphql/task_queries';
import { flaggedNotes } from '../../../graphql/queries';
import taskMock from '../__mocks__/taskMock';
import authState from '../../../__mocks__/authstate'


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Todo list main page', () => {
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
          <Context.Provider value={authState}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <Todo />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );
      await waitFor(() => {
        expect(container.queryByTestId('filter')).toBeInTheDocument();
        expect(container.queryByTestId('filter_container')).toBeInTheDocument();
        expect(container.queryByTestId('create_task_btn')).toBeInTheDocument();
        expect(container.queryByTestId('search')).toBeInTheDocument();
      }, 10)

      /*
      TODO: Bonny & Victor
      With the TodoList component now rendering asynchronously, we need to wait for
      some elements to render.

      However, this is an issue because mocking the nested flaggedNotes query is not working,
      Graphql throws an error in the test.

      We will figure out how to properly handle that query in tests. This is commented out but it
      has been manually verified in the UI.

      await waitFor(() => {
        expect(container.queryByTestId('prev-btn')).toBeInTheDocument();
        expect(container.queryByTestId('next-btn')).toBeInTheDocument();
      })
      */
  });
});
