import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import Invitations from '../Components/InvitationList';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { GuestEntriesQuery } from '../../graphql/guestbook_queries';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';

describe('Should render Guests View Component', () => {
  const mocks = {
    request: {
      query: GuestEntriesQuery,
      variables: { offset: 0 },
    },
    result: {
      data: {
        scheduledRequests: [
          {
            id: 'a91dbad4-eeb4',
            name: 'Test another',
            user: {
              id: '162f7517',
              name: 'Js user x',
              status: 'active',
            },
            guest: {
              id: '162f7517',
              name: 'Js user a',
              status: 'active',
            },
            closestEntryTime: {
              visitEndDate: null,
              visitationDate: '2021-08-20T10:51:00+02:00',
              endsAt: '2021-10-31 22:51',
              startsAt: '2021-10-31 02:51',
              occursOn: [],
            },
            status: 'approved',
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-20T10:51:00+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            endsAt: '2021-10-31 22:51',
            startsAt: '2021-10-31 02:51',
            exitedAt: '2021-10-31 22:51',
            revoked: true,
            thumbnailUrl: 'https://some-video.com',
            multipleInvites: true,
          },
          {
            id: '696d857',
            name: 'X Name',
            user: {
              id: '162f7517-69',
              name: 'Js sdd',
            },
            guest: {
              id: '162f7517',
              name: 'Js user x',
              status: 'active',
            },
            closestEntryTime: {
              visitEndDate: null,
              visitationDate: '2021-08-20T10:51:00+02:00',
              endsAt: '2021-10-31 22:51',
              startsAt: '2021-10-31 02:51',
              occursOn: [],
            },
            status: 'approved',
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-31T10:20:21+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            endsAt: '2021-10-31 22:51',
            startsAt: '2021-10-31 02:51',
            exitedAt: '2021-10-31 22:51',
            revoked: false,
            thumbnailUrl: null,
            multipleInvites: false,
          },
        ],
      },
    },
  };

  it('should render no invited guests since all invitations are invalid', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[mocks]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <Invitations />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('page_breadcrumb')).toBeInTheDocument();
    expect(container.getByText('common:misc.access')).toBeInTheDocument();
    expect(container.getByTestId('page_name')).toBeInTheDocument();
    expect(container.getByTestId('page_title')).toBeInTheDocument();
    expect(container.getByTestId('SearchIcon')).toBeInTheDocument();
    expect(container.getByTestId('AddIcon')).toBeInTheDocument();
    expect(container.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('search:search.load_more')).not.toBeInTheDocument();
      expect(container.queryByText('logbook.no_invited_guests')).toBeInTheDocument();
    });

    fireEvent.click(container.getByTestId('SearchIcon'));
    await waitFor(() => {
      expect(container.getAllByText('search:search.search_for')[0]).toBeInTheDocument();

      const inputField = container.getByTestId('search');
      expect(inputField).toBeInTheDocument();

      fireEvent.change(inputField, { target: { value: 'name' } });
      expect(inputField.value).toBe('name');
      expect(container.getByTestId('clear_search')).toBeInTheDocument();
      expect(container.getByTestId('ClearOutlinedIcon')).toBeInTheDocument();
      fireEvent.click(container.getByTestId('clear_search'));
    });

    fireEvent.click(container.getAllByTestId('SearchIcon')[0]);
    fireEvent.click(container.getByTestId('AddIcon'));
  });
});
