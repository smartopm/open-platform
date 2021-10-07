import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { GraphQLError } from 'graphql';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom';
import AccessCheck from '..';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import PermissionsQuery from '../graphql/queries';

describe('Permissions check', () => {
  const mocks = [
    {
      request: {
        query: PermissionsQuery,
        variables: { module: 'note', role: 'admin' }
      },
      result: {
        data: {
          permissions: [
            'can_create_note',
            'can_update_note',
            'can_set_note_reminder',
            'can_assign_note',
            'can_bulk_assign_note',
            'can_create_note_comment',
            'can_update_note_comment',
            'can_delete_note_comment',
            'can_fetch_flagged_notes',
            'can_fetch_task_by_id',
            'can_fetch_task_comments',
            'can_fetch_task_histories',
            'can_get_task_count',
            'can_get_task_stats',
            'can_get_user_tasks'
          ],
        },
      },
    }
  ];

  const networkErrorMock = {
      request: {
        query: PermissionsQuery,
        variables: { module: 'note', role: 'admin' }
      },
      error: new Error('Error: Network error'),
    };

  const graphQLErrorMock = {
    request: {
      query: PermissionsQuery,
      variables: { module: 'note', role: 'admin' }
    },
    result: {
      errors: [new GraphQLError('Error: GraphQL error')]
    },
  };

  const allowedPermissions = [
    'can_get_user_tasks',
    'can_fetch_task_by_id'
  ]

  it('renders loader', () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <AccessCheck module='note' allowedPermissions={allowedPermissions}>
              <h1>Test Component</h1>
            </AccessCheck>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders child component if user has permissions', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <AccessCheck module='note' allowedPermissions={allowedPermissions}>
              <h1>Test Component</h1>
            </AccessCheck>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(await screen.findByText('Test Component')).toBeInTheDocument();
  });

  it('does not render child component if user does not have permissions', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <AccessCheck module='note' allowedPermissions={['not_allowed', 'cant_see']}>
              <h1>Test Component</h1>
            </AccessCheck>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => expect(screen.queryAllByText('Test Component')).toHaveLength(0));
  });

  it('does not render child component if user is missing any permission', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <AccessCheck module='note' allowedPermissions={['can_get_user_tasks', 'missing_permission']}>
              <h1>Test Component</h1>
            </AccessCheck>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => expect(screen.queryAllByText('Test Component')).toHaveLength(0));
  });

  it('renders error page if network error occurs while fetching permissions', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[networkErrorMock]} addTypename={false}>
          <BrowserRouter>
            <AccessCheck module='note' allowedPermissions={['can_get_user_tasks']}>
              <h1>Test Component</h1>
            </AccessCheck>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  it('renders error page if GraphQL returns an error', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[graphQLErrorMock]} addTypename={false}>
          <BrowserRouter>
            <AccessCheck module='note' allowedPermissions={['can_get_user_tasks']}>
              <h1>Test Component</h1>
            </AccessCheck>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(await screen.findByText('GraphQL error')).toBeInTheDocument();
  });
});
