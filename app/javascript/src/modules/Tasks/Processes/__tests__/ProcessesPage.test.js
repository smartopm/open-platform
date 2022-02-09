import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import ProcessesPage from '../Components/ProcessesPage';

const mockHistoryPush = jest.fn();
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  }),
}));

describe('Processes page', () => {
  beforeEach(() => {
    authState.user.community.name = 'Tilisi';
  });

  it('redirects if community not allowed', () => {
    authState.user.community.name = 'Not Allowed City';
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <ProcessesPage />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('renders processes dashboard for admins', async () => {
    const mockAuthState = {
      ...authState,
      user: {
        ...authState.user,
        permissions: [
          {
            module: 'dashboard',
            permissions: ['can_access_admin_processes_dashboard']
          }
        ]
      }
    };

    render(
      <Context.Provider value={mockAuthState}>
        <MockedProvider>
          <BrowserRouter>
            <ProcessesPage />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('processes-admin-dashboard')).toBeInTheDocument();
    });
  });

  it('renders processes dashboard for clients', async () => {
    const mockAuthState = {
      ...authState,
      user: {
        ...authState.user,
        userType: 'developer',
        permissions: [
          {
            module: 'dashboard',
            permissions: ['can_access_client_processes_dashboard']
          }
        ]
      }
    };

    render(
      <Context.Provider value={mockAuthState}>
        <MockedProvider>
          <BrowserRouter>
            <ProcessesPage />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('processes-admin-dashboard')).toBeNull();
    });
  });
});
