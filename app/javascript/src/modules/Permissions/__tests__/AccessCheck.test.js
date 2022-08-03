import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import '@testing-library/jest-dom';
import AccessCheck from '..';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';

describe('Permissions check', () => {

  const allowedPermissions = [
    'can_see_menu_item',
    'can_get_user_tasks',
    'can_fetch_task_by_id',
  ]

  it('renders child component if user has permissions', async () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <AccessCheck module='note' allowedPermissions={allowedPermissions}>
            <h1>Test Component</h1>
          </AccessCheck>
        </BrowserRouter>
      </Context.Provider>
    );

    expect(await screen.findByText('Test Component')).toBeInTheDocument();
  });

  it('does not render child component if user does not have permissions', async () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <AccessCheck module='note' allowedPermissions={['not_allowed', 'cant_see']} show404ForUnauthorized={false}>
            <h1>Test Component</h1>
          </AccessCheck>
        </BrowserRouter>
      </Context.Provider>
    );

    await waitFor(() => expect(screen.queryAllByText('Test Component')).toHaveLength(0));
  });

  it('does not render child component if user is missing any permission', async () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <AccessCheck module='note' allowedPermissions={['can_get_user_tasks', 'missing_permission']} show404ForUnauthorized={false}>
            <h1>Test Component</h1>
          </AccessCheck>
        </BrowserRouter>
      </Context.Provider>
    );

    await waitFor(() => expect(screen.queryAllByText('Test Component')).toHaveLength(0));
  });

});
