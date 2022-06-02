import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';

import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
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

const mockAuthState = {
  ...authState,
  user: {
    ...authState.user,
    community: {
      ...authState.user.community,
      name: 'Tilisi'
    }
  }
};

describe('Processes page', () => {
  it('redirects if community not allowed', () => {
    const newAuthState = {
      ...authState,
      user: {
        ...authState.user,
        community: {
          ...authState.user.community,
          name: 'Not Allowed City'
        }
      }
    };

    render(
      <Context.Provider value={newAuthState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessesPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('renders processes dashboard for admins', async () => {
    const newAuthState = {
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
        permissions: [
          {
            module: 'dashboard',
            permissions: ['can_access_admin_processes_dashboard']
          }
        ]
      }
    };

    render(
      <Context.Provider value={newAuthState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessesPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('processes-admin-dashboard')).toBeInTheDocument();
    });
  });

  it('renders processes dashboard for consultants', async () => {
    const newAuthState = {
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
        userType: 'consultant',
        permissions: [
          {
            module: 'dashboard',
            permissions: ['can_access_admin_processes_dashboard']
          }
        ]
      }
    };

    render(
      <Context.Provider value={newAuthState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessesPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('processes-admin-dashboard')).toBeInTheDocument();
    });
  });

  it('renders processes dashboard for clients', async () => {
    const newAuthState = {
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
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
      <Context.Provider value={newAuthState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessesPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('processes-admin-dashboard')).toBeNull();
    });
  });
});
