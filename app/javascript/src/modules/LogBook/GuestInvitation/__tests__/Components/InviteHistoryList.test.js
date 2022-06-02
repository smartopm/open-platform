import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';
import InviteHistoryList from '../../Components/InviteHistoryList';
import { MyHostsQuery } from '../../graphql/queries';

describe('Invitation History list Component', () => {
  it('should render Invitation Histor List component', async () => {
    const invitation = {
      id: '4af00f39-7fcd-47d2-89bf-e93827d34666',
      createdAt: '2021-11-01T09:15:29Z',
      status: 'active',
      host: {
        id: '1388d45c-5279-4e90-9815-8ab33c49d382',
        name: 'Test two',
        imageUrl: null
      },
      entryTime: {
        id: '1841e4dc-0e7c-4297-be0b-3c00db12a668',
        occursOn: [],
        visitEndDate: null,
        visitationDate: '2021-11-30T11:54:00Z',
        endsAt: '2021-11-01T21:15:29Z',
        startsAt: '2021-11-01T09:15:29Z'
      }
    };

    const invitesMock = {
      request: {
        query: MyHostsQuery,
        variables: { userId: '234221' }
      },
      result: {
        data: {
          myHosts: [{ invitation }]
        }
      }
    };

    const container = render(
      <MemoryRouter>
        <MockedThemeProvider>
          <Context.Provider value={userMock}>
            <MockedProvider mock={[invitesMock]} addTypename>
              <InviteHistoryList tab="Invitations" userId="2-221" />
            </MockedProvider>
          </Context.Provider>
        </MockedThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(container.queryByTestId('loader')).toBeInTheDocument();
    }, 10)
  });
  it('should render errors', async () => {
    const invitesMock = {
      request: {
        query: MyHostsQuery,
        variables: { userId: '2-234221' }
      },
      result: {
        data: null
      },
      error: new Error('some new errors')
    };

    const container = render(
      <MemoryRouter>
        <MockedThemeProvider>
          <Context.Provider value={userMock}>
            <MockedProvider mock={[invitesMock]} addTypename={false}>
              <InviteHistoryList tab="Invitations" userId="2-234221" />
            </MockedProvider>
          </Context.Provider>
        </MockedThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(container.getByTestId('error')).toBeInTheDocument();
        expect(container.queryByText('guest_book.no_hosts')).toBeInTheDocument();
        expect(container.queryByText('guest_book.invite_history')).toBeInTheDocument();
    }, 30)
  });
});
