/* eslint-disable max-statements */
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import GuardPost from '../Components/GuardPost';
import { CurrentGuestEntriesQuery } from '../graphql/guestbook_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

describe('Should render Visits View Component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  const mocks = {
    request: {
      query: CurrentGuestEntriesQuery,
      variables: { offset: 0, limit: 20, query: '', type: 'allVisits', duration: null }
    },
    result: {
      data: {
        currentGuests: [
          {
            id: 'a91dbad4-eeb4',
            name: 'Test another',
            user: {
              id: '162f7517',
              name: 'Js user x',
              __typename: 'User'
            },
            guest: {
              id: '162f7517',
              name: 'Js user x',
              __typename: 'User'
            },
            grantor: {
              id: '8877hiolp',
              name: 'New Guard',
              __typename: 'User'
            },
            closestEntryTime: {
              visitEndDate: null,
              visitationDate: '2021-08-20T10:51:00+02:00',
              endsAt: '2021-10-31 22:51',
              startsAt: '2021-10-31 02:51',
              occursOn: [],
              __typename: 'EntryTime'
            },
            grantedAt: '2021-10-31 02:51',
            status: 'pending',
            exitedAt: null,
            guestId: "92839182",
            grantedState: 1,
            thumbnailUrl: 'https://some-videourl.com',
            __typename: 'EntryRequest'
          },
          {
            id: 'a91dbad4-293849dasda',
            name: 'User',
            user: {
              id: '23easd',
              name: 'user x',
              __typename: 'User'
            },
            guest: {
              id: '162f7517',
              name: 'Js user x',
              imageUrl: 'https://lh3.googleusercontent.com',
              __typename: 'User'
            },
            grantor: {
              id: '8877hiolp',
              name: 'New Guard',
              __typename: 'User'
            },
            closestEntryTime: null,
            grantedAt: '2021-10-31 02:51',
            status: 'approved',
            exitedAt: '2021-10-31 03:51',
            guestId: "162f7517",
            grantedState: 3,
            thumbnailUrl: null,
            __typename: 'EntryRequest'
          },
          {
            id: '92384932edas-293849dasda',
            name: 'Some User',
            user: {
              id: 'some some',
              name: 'user x',
               __typename: 'User'
            },
            grantor: {
              id: '8877hiolp',
              name: 'New Guard',
               __typename: 'User'
            },
            guest: null,
            closestEntryTime: null,
            grantedAt: '2021-10-31 02:51',
            status: 'pending',
            exitedAt: null,
            guestId: null,
            grantedState: 1,
            thumbnailUrl: null,
            __typename: 'EntryRequest'
          },
        ]
      }
    }
  };

  const errorMock = {
    request: {
      query: CurrentGuestEntriesQuery,
      variables: { offset: 0, limit: 20, query: '', type: 'allVisits', duration: null }
    },
    result: {
      data: {
        currentGuests: null
      }
    },
    error: new Error('Something wrong happened')
  };

  it('should render proper data', async () => {
    const { getAllByTestId, getByText, getByTestId } = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[mocks]} addTypename>
          <MemoryRouter>
            <MockedThemeProvider>
              <GuardPost />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(getByTestId('access_search')).toBeInTheDocument();
      expect(getByTestId('reload')).toBeInTheDocument();
      expect(getByTestId('add_button')).toBeInTheDocument();
      expect(getByText('logbook.total_entries')).toBeInTheDocument();
      expect(getByText('logbook.total_exits')).toBeInTheDocument();
      expect(getByText('logbook.total_in_city')).toBeInTheDocument();
      expect(getByText('Test another')).toBeInTheDocument();
      expect(getByText('Js user x')).toBeInTheDocument();
      expect(getByText('logbook:logbook.host:')).toBeInTheDocument();
      expect(getAllByTestId('entered_at')[0]).toBeInTheDocument();
      expect(getAllByTestId('request_avatar')[0].textContent).toContain('U');
      expect(getAllByTestId('request_avatar')[1].textContent).toContain('S');
      expect(getAllByTestId('video_preview')[0]).toBeInTheDocument();
      expect(getAllByTestId('exited_at')[0]).toBeInTheDocument();
      expect(getAllByTestId('exited_at')[0].textContent).toContain('logbook.log_exit');
      expect(getAllByTestId('exited_at')[1].textContent).toContain('guest_book.exited_at');
      expect(getAllByTestId('log_exit')[0]).toBeInTheDocument();
      expect(getAllByTestId('guest_validity')[0]).toBeInTheDocument();
      expect(getAllByTestId('entry_state')[0].textContent).toContain('guest_book.invalid_now');
      expect(getAllByTestId('entry_state')[1].textContent).toContain('guest_book.scanned_entry');
      expect(getAllByTestId('entry_state')[2].textContent).toContain('guest_book.manual_entry');
      expect(getAllByTestId('host_title')[0].textContent).toContain('logbook:logbook.host');
      expect(getAllByTestId('host_title')[1].textContent).toContain('logbook:log_title.guard:  ');
      expect(getAllByTestId('host_title')[2].textContent).toContain('logbook:log_title.guard:  ');
      expect(getAllByTestId('request_status')[0]).toBeInTheDocument();
      expect(getAllByTestId('request_status')[0].textContent).toContain('guest_book.pending');
      expect(getAllByTestId('request_status')[1].textContent).toContain('guest_book.approved');
      expect(getAllByTestId('log_exit')[0]).not.toBeDisabled();
      expect(getAllByTestId('prev-btn')[0]).toBeInTheDocument();
      expect(getAllByTestId('next-btn')[0]).toBeInTheDocument();

      fireEvent.click(getByTestId('add_button'));
      expect(getByText('logbook.new_invite')).toBeInTheDocument();
      expect(getByText('logbook.add_observation')).toBeInTheDocument();

      fireEvent.click(getByText('logbook.new_invite'));
      expect(mockHistory.push).toBeCalled();

      fireEvent.click(getByText('logbook.add_observation'));
      expect(getByText('observations.add_your_observation')).toBeInTheDocument();
      fireEvent.change(getByTestId('entry-dialog-field'), {
        target: { value: 'This is an observation' }
      });
      expect(getByTestId('entry-dialog-field').value).toBe('This is an observation');
      fireEvent.click(getByTestId('save'));

      fireEvent.click(getAllByTestId('log_exit')[0]);
      fireEvent.click(getAllByTestId('card')[3]);
      expect(mockHistory.push).toBeCalled();
      expect(getAllByTestId('card')[0]).toBeInTheDocument();

      fireEvent.click(getAllByTestId('user_name')[0]);
      expect(getAllByTestId('user_name')[0].textContent).toContain('Js user x');
      expect(mockHistory.push).toBeCalled();
      expect(mockHistory.push).toBeCalledWith('/user/162f7517'); // check if it routes to the user page

      fireEvent.click(getAllByTestId('next-btn')[0]);
      fireEvent.click(getByTestId('access_search'));
      expect(getByTestId('search')).toBeInTheDocument();
      fireEvent.click(getByTestId('reload'));
    }, 100);
  });

  it('should render error if something went wrong', async () => {
    const { getByText } = render(
      <Context.Provider value={authState}>
        <MemoryRouter>
          <MockedProvider mocks={[errorMock]} addTypename>
            <MockedThemeProvider>
              <GuardPost />
            </MockedThemeProvider>
          </MockedProvider>
        </MemoryRouter>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(getByText('Something wrong happened')).toBeInTheDocument();
      expect(getByText('logbook.no_invited_guests')).toBeInTheDocument();
    }, 100);
  });
});
